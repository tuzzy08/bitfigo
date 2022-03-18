import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WalletModule,
    // Initialize Sentry JS
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: true,
    }),
    // Initialize Mongoose
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    AuthModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController, AdminController],
})
export class AppModule {}
