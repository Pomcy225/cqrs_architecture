
import { Module } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { WalletTransactionService } from './service/wallet.transactions.service';
import { WalletTransactionController } from './controllers/wallet.transaction.controller';

@Module({
  providers: [WalletTransactionService, DBUtil, ApiResponseService],
  controllers: [WalletTransactionController],
})
export class WalletTransactionModule {}
