import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { LoginInputDto } from './dto/login-input.dto';
import { userStatus } from '../utils/enums';
import { User } from '../users/entities/user.entity';
import { IUserPayload } from './interfaces/user-payload.interface';
import { IUserEmailConfirmation } from './interfaces/user-email-confirmation.interface';
import { ChangePasswordInputDto } from './dto/change-password-input.dto';
import { handleDBExceptions } from '../utils/handlers';
import { MailService } from '../mail/mail.service';
import { RecoverPasswordInputDto } from './dto/recover-password-input.dto';
import { generateRandom } from '../utils/functions';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async login(loginInputDto: LoginInputDto) {
    const { email, password } = loginInputDto;
    const user = await this.validateUser(email, password);
    if (!user) throw new BadRequestException(`Email or password are invalid`);
    if (user.status !== userStatus.ACTIVE)
      throw new UnauthorizedException(
        `User must be active. Status is ${user.status}`,
      );
    const tokens = await this.generateUserTokens(user);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async validateUser(email: string, password: string): Promise<IUserPayload> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          company: user.company,
          roles: user.roles,
          status: user.status,
        };
      }
    }
    return null;
  }

  async generateUserTokens(user: IUserPayload) {
    const payload: IUserPayload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      company: user.company,
      roles: user.roles,
      status: user.status,
    };
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);
    return {
      token,
      refreshToken,
    };
  }

  async updateRefreshToken(id: Schema.Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = bcrypt.hashSync(
      refreshToken,
      parseInt(this.configService.get<string>('HASHING_SALT')),
    );
    try {
      await this.userModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { refreshToken: hashedRefreshToken } },
          { new: true },
        )
        .exec();
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async confirmUserEmail(confirmEmailDto: IUserEmailConfirmation) {
    const { token } = confirmEmailDto;
    const email = await this.decodeEmailToken(token);
    return await this.confirmEmail(email);
  }

  async decodeEmailToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN'),
      });
      if (typeof payload === 'object' && 'email' in payload)
        return payload.email;
      throw new BadRequestException(`Bad confirmation token`);
    } catch (error) {
      if (error?.name === 'TokenExpiredError')
        throw new BadRequestException(`Email confirmation token expired`);
      throw new BadRequestException(`Bad confirmation token`);
    }
  }

  async confirmEmail(email: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) throw new NotFoundException(`User not found`);
    if (existingUser.status !== userStatus.ACTIVATION_PENDING)
      throw new BadRequestException(
        `User status is not correct or this link does not work anymore`,
      );
    try {
      await existingUser
        .updateOne({
          $set: { status: userStatus.ACTIVE },
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Unexpected error updating user after confirmation`,
      );
    }
    await this.mailService.sendEmailToUser(
      email,
      '[Camba v0.1] Your email was confirmed',
      'Your email was successfully confirmed. Now you can log in.',
    );
    return { statusCode: 204, message: 'User email confirmated' };
  }

  async changePassword(
    userId: Schema.Types.ObjectId,
    changePasswordInputDto: ChangePasswordInputDto,
  ) {
    const { password } = changePasswordInputDto;
    const user = await this.userModel.findOne({ _id: userId });
    if (user.status !== userStatus.ACTIVE)
      throw new BadRequestException(
        `User must be active. Status: ${user.status}`,
      );
    if (await bcrypt.compare(password, user.password)) {
      throw new BadRequestException(`Password can not be the same as above`);
    }
    const newPassword = bcrypt.hashSync(
      password,
      parseInt(this.configService.get<string>('HASHING_SALT')),
    );
    user.password = newPassword;
    user.passwordChanged = true;
    try {
      await user.save();
      await this.mailService.sendEmailToUser(
        user.email,
        '[Camba v0.1] Your password was changed recently',
        'Your password was successfully changed. If you did not request this email you can safely ignore it.',
      );
      return { statusCode: 204, message: 'Password changed successfully' };
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordInputDto) {
    const { email } = recoverPasswordDto;
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException(`This email does not exist in our database`);
    if (user.status !== userStatus.ACTIVE)
      throw new BadRequestException(
        `User must be active. Status: ${user.status}`,
      );
    const randomPassword = generateRandom();
    const temporaryPassword = bcrypt.hashSync(
      randomPassword,
      parseInt(this.configService.get<string>('HASHING_SALT')),
    );
    user.password = temporaryPassword;
    user.passwordChanged = false;
    try {
      await user.save();
      await this.mailService.sendEmailToUser(
        email,
        '[Camba v0.1] Recover your credentials',
        `Enter with your email and the following temporary password: ${randomPassword}. Then you can change it with a desirable password`,
      );
      return { statusCode: 204, message: 'Password recovered successfully' };
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async refreshTokens(userId: Schema.Types.ObjectId, refreshToken: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user || !user.refreshToken)
      throw new ForbiddenException(`Access Denied`);
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException(`Access Denied`);
    const tokens = await this.generateUserTokens(user);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(id: Schema.Types.ObjectId) {
    try {
      return await this.userModel
        .findOneAndUpdate({ _id: id }, { $set: { refreshToken: null } })
        .exec();
    } catch (error) {
      handleDBExceptions(error);
    }
  }
}
