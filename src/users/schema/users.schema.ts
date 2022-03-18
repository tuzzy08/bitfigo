import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  mobile: string;

  @Prop({ default: '' })
  cryptoAddress: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  })
  walletID: string;

  @Prop({ default: Role.User })
  role: Role[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
