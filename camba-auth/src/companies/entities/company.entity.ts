import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { companyStatus } from '../../utils/enums';

@Schema({ timestamps: true })
export class Company {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  tributaryType: string;

  @Prop({ unique: true })
  tributaryNumber: string;

  @Prop({ unique: true })
  fullName: string;

  @Prop({ unique: true })
  shortName: string;

  @Prop({ default: companyStatus.ACTIVATION_PENDING })
  status: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
