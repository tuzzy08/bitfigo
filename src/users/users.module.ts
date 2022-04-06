import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { WalletModule } from '../wallet/wallet.module';
import { UsersSchema, Users } from './schema/users.schema';

@Module({
  imports: [
    // forwardRef is used here to resolve circular import
    forwardRef(() => WalletModule),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
