import { Module } from '@nestjs/common';

import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { OperateurMobileMoneyController } from './controllers/operateur.mobile.money.controller';
import { ServiceOperateurMobileMoney } from './services/operateur.mobile.money.service';

@Module({
  imports: [],
  providers: [ServiceOperateurMobileMoney, ApiResponseService],
  controllers: [OperateurMobileMoneyController],
})
export class OperateurMobileMoneyModule {}
