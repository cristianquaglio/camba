import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Schema } from 'mongoose';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { roles } from '../utils/enums';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiCreatedResponse()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOkResponse()
  findAll() {
    return this.companiesService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.SA)
  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Company #1 is not found' })
  findOne(@Param('id') id: Schema.Types.ObjectId) {
    return this.companiesService.findOne(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.SA)
  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Company #1 is not found' })
  update(
    @Param('id') id: Schema.Types.ObjectId,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.SA)
  @Delete(':id')
  @ApiOkResponse()
  remove(@Param('id') id: Schema.Types.ObjectId) {
    return this.companiesService.remove(id);
  }
}
