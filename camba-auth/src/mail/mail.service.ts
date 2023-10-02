import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IUserMailed } from './interfaces/user-mailed';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(
    token: string,
    user: IUserMailed,
    isAdmin: boolean = false,
  ) {
    const uri = `${this.configService.get(
      'EMAIL_CONFIRMATION_ROUTE',
    )}?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Camba v0.1! Confirm your email',
      template: isAdmin ? './confirmation-admin' : './confirmation',
      context: {
        name: user.name,
        uri,
        email: user.email,
        password: user.password,
      },
    });
  }

  async sendEmailToUser(email: string, subject: string, message: string) {
    return await this.mailerService.sendMail({
      to: email,
      subject,
      template: './message',
      context: {
        message,
      },
    });
  }
}
