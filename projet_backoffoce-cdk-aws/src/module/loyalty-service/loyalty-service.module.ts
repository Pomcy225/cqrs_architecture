
import { Module } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { GrilleTarifaireController } from './Controller/grille-tarifaire.controller';
import { GrilleTarifaireService } from './Service/grille-tarifaire.service';
import { AccountController } from './Controller/account.controller';
import { TransactionController } from './Controller/transaction.controller';
import { AccountService } from './Service/account.service';
import { TransactionService } from './Service/transaction.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { ConversionController } from './Controller/conversion.controller';
import { ConversionService } from './Service/conversion.service';

@Module({
  controllers: [
    GrilleTarifaireController,
    AccountController,
    TransactionController,
    ConversionController
  ],
  providers: [
    GrilleTarifaireService,
    DBUtil,
    AccountService,
    TransactionService,
    ApiResponseService,
    ConversionService
  ],
})
export class LoyaltyServiceModule {}
