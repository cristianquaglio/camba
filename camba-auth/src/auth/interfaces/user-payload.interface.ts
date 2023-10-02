import { Schema } from 'mongoose';

export interface IUserPayload {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  company: Schema.Types.ObjectId;
  roles: string[];
  status: string;
}
