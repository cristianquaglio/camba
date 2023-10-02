import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { userRoles } from '../../utils/enums';

export class CreateUserDto {
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
    description: 'User roles',
    required: true,
    enum: userRoles,
    example: '[PATIENT]',
  })
  @IsEnum(userRoles, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  roles: userRoles[];
}
