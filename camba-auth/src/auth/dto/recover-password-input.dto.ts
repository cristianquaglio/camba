import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverPasswordInputDto {
  @ApiProperty({
    description: 'Email',
    required: true,
    example: 'cristian@gmail.com',
    type: String,
  })
  @IsEmail()
  email: string;
}
