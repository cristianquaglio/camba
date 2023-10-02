import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginInputDto {
  @ApiProperty({
    description: 'Email',
    required: true,
    example: 'cristian@gmail.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password: (min: 8, max: 16. The password must have an uppercase, lowercase letter and a number)',
    required: true,
    example: 'Admin123',
    type: String,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have an uppercase, lowercase letter and a number',
  })
  password: string;
}
