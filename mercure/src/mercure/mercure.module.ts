import { Module } from '@nestjs/common';
import { MercureService } from './mercure.service';
import { NotificationController } from './notification.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      isGlobal: true,
    }),
  ],
  providers: [MercureService],
  controllers: [NotificationController],
})
export class MercureModule {}