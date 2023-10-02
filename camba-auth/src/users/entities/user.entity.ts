import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, SchemaTypes } from 'mongoose';

import { roles, userStatus } from '../../utils/enums';
import { Company } from '../../companies/entities/company.entity';

@Schema({ timestamps: true })
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Company.name,
  })
  company: MongooseSchema.Types.ObjectId;

  @Prop()
  roles: roles[];

  @Prop({ default: userStatus.ACTIVATION_PENDING })
  status: string;

  @Prop({ default: false })
  passwordChanged: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
