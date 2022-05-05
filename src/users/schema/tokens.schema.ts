import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  value: string;
  // let's make it expire after 10 min
  @Prop({
    required: true,
    default: new Date(Date.now() + 10 * 60 * 1000),
  })
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
