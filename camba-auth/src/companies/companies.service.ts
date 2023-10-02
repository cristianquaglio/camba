import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { handleDBExceptions } from '../utils/handlers';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = new this.companyModel(createCompanyDto);
      return await company.save();
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.companyModel.find().exec();
  }

  async findOne(id: Schema.Types.ObjectId) {
    let company;
    try {
      company = await this.companyModel.findOne({ _id: id }).exec();
    } catch (error) {
      handleDBExceptions(error);
    }
    if (!company) throw new NotFoundException(`Company #${id} is not found`);
    return company;
  }

  async update(id: Schema.Types.ObjectId, updateCompanyDto: UpdateCompanyDto) {
    let existingCompany;
    try {
      existingCompany = await this.companyModel
        .findOneAndUpdate(
          { _id: id },
          { $set: updateCompanyDto },
          { new: true },
        )
        .exec();
    } catch (error) {
      handleDBExceptions(error);
    }
    if (!existingCompany)
      throw new NotFoundException(`Company #${id} is not found`);
    return existingCompany;
  }

  async remove(id: Schema.Types.ObjectId) {
    const company = await this.findOne(id);
    return company.deleteOne();
  }
}
