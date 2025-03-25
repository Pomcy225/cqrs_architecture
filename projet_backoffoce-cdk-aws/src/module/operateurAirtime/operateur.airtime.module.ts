import { Module } from '@nestjs/common';

import { OperateurAirtimeService } from './services/operateur.airtime.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { OperateurAirtimeController } from './controllers/operateur.airtime.controller';

@Module({
  imports: [],
  providers: [OperateurAirtimeService, ApiResponseService],
  controllers: [OperateurAirtimeController],
})
export class OperateurAirtimeModule {}
