import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Schema } from 'mongoose';

import { userStatus, userRoles } from '../../utils/enums';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User ID',
    required: true,
    type: String,
    example: '6518f1ccea02940ecf572aba',
  })
  _id: Schema.Types.ObjectId;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'Cristian',
    type: String,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Quagliozzi',
    type: String,
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Username',
    example: 'cristian.quagliozzi',
    type: String,
  })
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional({
    description: 'User roles',
    enum: userRoles,
    example: '[PATIENT]',
  })
  @IsOptional()
  @IsEnum(userRoles, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  roles: userRoles[];

  @ApiPropertyOptional({
    description: 'User status',
    enum: userStatus,
    example: '[ACTIVE]',
  })
  @IsOptional()
  @IsEnum(userStatus)
  status: string;
}
