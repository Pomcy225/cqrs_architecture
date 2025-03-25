import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MercureModule } from './mercure/mercure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsConsumerService } from './sqs/sqs_consumer_service';
import { MercureService } from './mercure/mercure.service';
import { SqsConsumerSoldeService } from './sqs_solde/sqs_consumer_solde_service';
import { DBUtil } from './utils/db-utils';
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    MercureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SqsConsumerService,
    MercureService,
    SqsConsumerSoldeService,
    DBUtil,
  ],
})
export class AppModule {}
