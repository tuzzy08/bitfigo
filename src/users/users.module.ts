import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { WalletModule } from '../wallet/wallet.module';
import { UsersSchema, Users } from './schema/users.schema';
import { VCode, VCodeSchema } from './schema/vCode.schema';

@Module({
  imports: [
    // forwardRef is used here to resolve circular import
    forwardRef(() => WalletModule),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: VCode.name, schema: VCodeSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
