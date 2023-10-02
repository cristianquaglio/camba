import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
    }),
    UsersModule,
    CompaniesModule,
    DbModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
