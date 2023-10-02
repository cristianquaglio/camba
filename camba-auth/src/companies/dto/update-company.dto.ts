import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({
    description: 'Company ID',
    required: true,
    type: String,
    example: '6518ef4793788fa3187119cd',
  })
  _id: Schema.Types.ObjectId;
}
