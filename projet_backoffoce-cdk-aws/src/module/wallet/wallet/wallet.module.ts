
import { Module } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { WalletService } from './service/wallet.service';
import { WalletController } from './controllers/wallet.controller';

@Module({
  providers: [WalletService, DBUtil, ApiResponseService],
  controllers: [WalletController],
})
export class WalletModule {}
