import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { WalletModule } from '../wallet/wallet.module';
import { UsersSchema, Users } from './schema/users.schema';

@Module({
  imports: [
    WalletModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
