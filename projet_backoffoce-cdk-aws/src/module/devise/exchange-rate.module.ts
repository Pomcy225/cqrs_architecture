import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateController } from './exchange-rate.controller';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService, ApiResponseService],
})
export class ExchangeRateModule {}
