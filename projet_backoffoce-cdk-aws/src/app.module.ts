import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlaceModule } from './module/place/place.module';
import { BedooMallModule } from './module/bedoomall/bedoomall.module';
import { LoyaltyServiceModule } from './module/loyalty-service/loyalty-service.module';
import { TransactionModule } from './module/wallet/transaction/transaction.module';
import { ApiResponseService } from './utils/response_api/api_response_service';
import { PlafondModule } from './module/wallet/plafond/plafond.module';
import { ExchangeRateModule } from './module/devise/exchange-rate.module';
import { CartModule } from './module/commande_cart/cart.module';
import { UserModule } from './module/user/place.module';
import { OperateurAirtimeModule } from './module/operateurAirtime/operateur.airtime.module';
import { WalletTransactionModule } from './module/wallet/wallet-transaction/wallet.transaction.module';
import { OperateurMobileMoneyModule } from './module/operateurMobileMoney/operateur.mobile.money.module';
import { WalletModule } from './module/wallet/wallet/wallet.module';
import { TicketModule } from './module/ticket/ticket.module';
import { livraisonModule } from './module/livraison/livreur.module';

@Module({
  imports: [
    ExchangeRateModule,
    PlaceModule,
    livraisonModule,
    BedooMallModule,
    LoyaltyServiceModule,
    TransactionModule,
    PlafondModule,
    CartModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OperateurAirtimeModule,
    WalletTransactionModule,
    OperateurMobileMoneyModule,
    WalletModule,
    TicketModule,
  ],

  controllers: [AppController],
  providers: [AppService, ApiResponseService],
})
export class AppModule {}
