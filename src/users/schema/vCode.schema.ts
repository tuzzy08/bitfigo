import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type VCodeDocument = VCode & Document;

@Schema({ timestamps: true })
export class VCode {
  @Prop({ required: true })
  username: string;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop({ required: true })
  value: string;
}

export const VCodeSchema = SchemaFactory.createForClass(VCode);
