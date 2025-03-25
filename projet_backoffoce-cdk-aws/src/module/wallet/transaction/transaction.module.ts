
import { Module } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { TransactionsService } from './service/transactions.service';
import { ExterneService } from './service/externe.service';
import { InterneService } from './service/interne.service';
import { InterneController } from './controllers/interne.controller';
import { ExterneController } from './controllers/Externe.controller';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  providers: [
    TransactionsService,
    ExterneService,
    InterneService,
    DBUtil,
    ApiResponseService,
  ],
  controllers: [
    TransactionsController,
    InterneController,
    ExterneController
    ],
})
export class TransactionModule {}
