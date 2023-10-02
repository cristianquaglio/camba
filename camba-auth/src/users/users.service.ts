import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { handleDBExceptions } from '../utils/handlers';
import { CreateAdminDto } from './dto/create-admin.dto';
import { generateRandom } from '../utils/functions';
import { roles } from '../utils/enums';
import { IUserMailed } from '../mail/interfaces/user-mailed';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const user = new this.userModel({
        ...createAdminDto,
        roles: roles.CONTENT_ADMIN,
        password: bcrypt.hashSync(
          createAdminDto.password,
          parseInt(this.configService.get<string>('HASHING_SALT')),
        ),
      });
      const savedUser = await user.save();
      const { email } = savedUser;
      const payload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN'),
        expiresIn: this.configService.get('EMAIL_VERIFICATION_EXPIRATION_TIME'),
      });
      const userMailed: IUserMailed = {
        name: `${savedUser.firstName} ${savedUser.lastName}`,
        email: savedUser.email,
      };
      const isAdmin = true;
      await this.mailService.sendUserConfirmation(token, userMailed, isAdmin);
      return { statusCode: 201, message: 'User created successfully' };
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
    company: Schema.Types.ObjectId,
  ) {
    const generatedPassword = generateRandom();
    try {
      const user = new this.userModel({
        ...createUserDto,
        company,
        password: bcrypt.hashSync(
          generatedPassword,
          parseInt(this.configService.get<string>('HASHING_SALT')),
        ),
      });
      const savedUser = await user.save();
      const { email } = savedUser;
      const payload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN'),
        expiresIn: this.configService.get('EMAIL_VERIFICATION_EXPIRATION_TIME'),
      });
      const userMailed: IUserMailed = {
        name: `${savedUser.firstName} ${savedUser.lastName}`,
        email: savedUser.email,
        password: generatedPassword,
      };
      const isAdmin = false;
      await this.mailService.sendUserConfirmation(token, userMailed, isAdmin);
      return { statusCode: 201, message: 'User created successfully' };
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async findAll(company: Schema.Types.ObjectId) {
    return await this.userModel
      .find({ company })
      .select(['-password', '-__v'])
      .exec();
  }

  async findOne(id: Schema.Types.ObjectId, company: Schema.Types.ObjectId) {
    let user;
    try {
      user = await this.userModel
        .findOne({ _id: id, company })
        .select(['-password', '-__v'])
        .exec();
    } catch (error) {
      handleDBExceptions(error);
    }
    if (!user) throw new NotFoundException(`User #${id} is not found`);
    return user;
  }

  async update(
    id: Schema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
    company: Schema.Types.ObjectId,
  ) {
    let existingUser;
    try {
      existingUser = await this.userModel
        .findOneAndUpdate(
          { _id: id, company },
          { $set: updateUserDto },
          { new: true },
        )
        .select(['-password', '-__v'])
        .exec();
    } catch (error) {
      handleDBExceptions(error);
    }
    if (!existingUser) throw new NotFoundException(`User #${id} is not found`);
    return existingUser;
  }

  async remove(id: Schema.Types.ObjectId, company: Schema.Types.ObjectId) {
    const user = await this.findOne(id, company);
    return user.deleteOne();
  }
}
