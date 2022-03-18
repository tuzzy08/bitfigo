import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Users } from '../../users/schema/users.schema';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  owner: string;

  @Prop({
    type: Map,
  })
  balances: Record<any, any>;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
