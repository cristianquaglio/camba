import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Schema } from 'mongoose';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { roles } from '../utils/enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  @ApiCreatedResponse({ description: 'User created successfully' })
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.CONTENT_ADMIN)
  @Post()
  @ApiCreatedResponse({ description: 'User created successfully' })
  createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.usersService.createUser(createUserDto, req.user['company']);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.CONTENT_ADMIN)
  @Get()
  @ApiOkResponse()
  findAll(@Req() req: Request) {
    return this.usersService.findAll(req.user['company']);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.CONTENT_ADMIN)
  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'User #1 is not found' })
  findOne(@Param('id') id: Schema.Types.ObjectId, @Req() req: Request) {
    return this.usersService.findOne(id, req.user['company']);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.CONTENT_ADMIN)
  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'User #1 is not found' })
  update(
    @Param('id') id: Schema.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.update(id, updateUserDto, req.user['company']);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(roles.CONTENT_ADMIN)
  @Delete(':id')
  @ApiOkResponse()
  remove(@Param('id') id: Schema.Types.ObjectId, @Req() req: Request) {
    return this.usersService.remove(id, req.user['company']);
  }
}
