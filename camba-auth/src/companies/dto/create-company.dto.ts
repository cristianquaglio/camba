import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { companyStatus, companyTypes, tributaryTypes } from '../../utils/enums';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Type of company',
    required: true,
    enum: companyTypes,
    example: 'PRIVATE',
  })
  @IsNotEmpty()
  @IsEnum(companyTypes)
  type: string;

  @ApiProperty({
    description: 'Tributary type',
    required: true,
    enum: tributaryTypes,
    example: 'CUIT',
  })
  @IsNotEmpty()
  @IsEnum(tributaryTypes)
  tributaryType: string;

  @ApiProperty({
    description: 'Tributary number',
    required: true,
    example: '20-27189130-0',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  tributaryNumber: string;

  @ApiProperty({
    description: 'Company full name',
    required: true,
    example: 'Centro de Diagnóstico Nosiglia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Company short name',
    required: true,
    example: 'Centro Nosiglia',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  shortName: string;

  @ApiPropertyOptional({
    description: 'Status',
    required: true,
    enum: companyStatus,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(companyStatus)
  status: string;
}
