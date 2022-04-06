import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true })
class Deposits {
  @Prop({})
  token: string;
  @Prop({})
  amount: string;
  @Prop({})
  network: string;
  @Prop({})
  address: string;
  @Prop({})
  status: string;
}
@Schema({ timestamps: true })
class Withdrawals {
  @Prop({})
  token: string;
  @Prop({})
  amount: string;
  @Prop({})
  network: string;
  @Prop({})
  status: string;
}
@Schema({ timestamps: true })
class Transfers {
  @Prop({})
  token: string;
  @Prop({})
  amount: string;
  @Prop({})
  network: string;
  @Prop({})
  status: string;
}
@Schema({ timestamps: true })
class Conversions {
  @Prop({})
  baseToken: string;
  @Prop({})
  destinationToken: string;
  @Prop({})
  baseTokenamount: string;
  @Prop({})
  destinationTokenamount: string;
  @Prop({})
  status: string;
}

@Schema()
class History {
  @Prop()
  deposits: [Deposits];
  @Prop()
  withdrawals: [Withdrawals];
  @Prop()
  transfers: [Transfers];
  @Prop()
  conversions: [Conversions];
}

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  mobile: string;

  @Prop({
    type: Map,
  })
  wallet: Record<any, any>;

  @Prop()
  history: [History];

  @Prop({ default: Role.User })
  role: Role[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
