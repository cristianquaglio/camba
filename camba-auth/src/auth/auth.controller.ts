import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/login-input.dto';
import { IUserEmailConfirmation } from './interfaces/user-email-confirmation.interface';
import { ChangePasswordInputDto } from './dto/change-password-input.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RecoverPasswordInputDto } from './dto/recover-password-input.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Email or password are invalid' })
  @ApiUnauthorizedResponse({
    description: `User must be active. Status is 'ACTIVATION_PENDING'`,
  })
  login(@Body() loginInputDto: LoginInputDto) {
    return this.authService.login(loginInputDto);
  }

  @Get('confirm')
  @ApiResponse({ status: 204, description: 'User email confirmated' })
  @ApiBadRequestResponse({
    description:
      'Bad confirmation token / Email confirmation token expired / User status is not correct or this link does not work anymore',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error updating user after confirmation',
  })
  confirmUserEmail(@Query() token: IUserEmailConfirmation) {
    return this.authService.confirmUserEmail(token);
  }

  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  @ApiResponse({ status: 204, description: 'Password changed successfully' })
  @ApiBadRequestResponse({
    description: `User must be active. Status: 'ACTIVATION_PENDING' / Password can not be the same as above`,
  })
  @ApiBadRequestResponse({
    description: `Password can not be the same as above`,
  })
  changePassword(
    @Body() changePasswordInputDto: ChangePasswordInputDto,
    @Req() req: Request,
  ) {
    return this.authService.changePassword(
      req.user['_id'],
      changePasswordInputDto,
    );
  }

  @Post('recover-password')
  @ApiResponse({ status: 204, description: 'Password recovered successfully' })
  @ApiNotFoundResponse({
    description: 'This email does not exist in our database',
  })
  @ApiBadRequestResponse({
    description: `User must be active. Status: 'ACTIVATION_PENDING'`,
  })
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordInputDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOkResponse()
  @ApiForbiddenResponse({ description: 'Access Denied' })
  refreshTokens(@Req() req: Request) {
    const userId = req.user['_id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @ApiOkResponse()
  logout(@Req() req: Request) {
    this.authService.logout(req.user['_id']);
  }
}
