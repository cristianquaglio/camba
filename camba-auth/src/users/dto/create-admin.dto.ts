import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema } from 'mongoose';

export class CreateAdminDto {
  @ApiProperty({
    description: 'First name',
    required: true,
    example: 'Cristian',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    required: true,
    example: 'Quagliozzi',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Username',
    required: true,
    example: 'cristian.quagliozzi',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

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

  @ApiProperty({
    description: 'Company',
    required: true,
    example: '6518ef4793788fa3187119cd',
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  company: Schema.Types.ObjectId;
}
