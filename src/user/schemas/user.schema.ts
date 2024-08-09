import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Role {
  VISITOR = 'Visitor',
  ADMIN = 'Admin',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Role })
  role: Role;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
