import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';
import { conversionStatus } from '../enums/status.enum';
import { AccountStatus } from '../enums/accountStatus.enum';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true })
class Deposits {
  @Prop({})
  token: string;
  @Prop({})
  amount: string;
  @Prop({})
  network: string;
  // @Prop({})
  // address: string;
  @Prop({ default: conversionStatus.PENDING })
  status: string;
}
@Schema({ timestamps: true })
class Withdrawals {
  @Prop()
  token: string;

  @Prop()
  amount: number;

  @Prop()
  network: string;

  @Prop()
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
  baseTokenAmount: string;
  @Prop({})
  destinationTokenAmount: string;
  @Prop({})
  status: string;
}

@Schema()
class History {
  @Prop({ default: () => [] })
  deposits: [Deposits];
  @Prop({ default: () => [] })
  withdrawals: [Withdrawals];
  @Prop({ default: () => [] })
  transfers: [Transfers];
  @Prop({ default: () => [] })
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

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  zipcode: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  mobile: string;

  @Prop({ default: AccountStatus.ACTIVE })
  status: string;

  @Prop({
    type: Map,
  })
  wallet: Record<any, any>;

  @Prop({ default: () => ({}) })
  history: History;

  @Prop({ default: Role.User })
  role: Role[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
