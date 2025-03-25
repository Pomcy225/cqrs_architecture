import { Controller, Get, Query, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { WalletTransactionFilterDto } from '../dto/wallet.transaction.filter.dto';
import { WalletTransactionService } from '../service/wallet.transactions.service';

@ApiTags('Wallet Transaction')
@Controller('/transaction/wallet')
export class WalletTransactionController {
  constructor(
    private readonly walletTransactionService: WalletTransactionService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filters: WalletTransactionFilterDto,
  ) {
    try {
      const data = await this.walletTransactionService.findAll(
        paginationDto,
        filters,
      );
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Liste des Wallet Transaction recuperée')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          error.message ||
            'Erreur lors de la récupération des WalletTransaction',
        )
        .response(null);
    }
  }


  @Get('total/wallet/:userId')
  async totalWallet( @Param('userId') userId: string): Promise<any> {
    try {
      const data = await this.walletTransactionService.totalWallet(userId);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Liste des Wallet Transaction recuperée')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          error.message ||
            'Erreur lors de la récupération des WalletTransaction',
        )
        .response(null);
    }
  }
  @Get('total/compte/:userId')
  async totalTransaction( @Param('userId') userId: string): Promise<any> {
    try {
      const data = await this.walletTransactionService.soldeWallet(userId);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Liste des Wallet Transaction recuperée')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          error.message ||
            'Erreur lors de la récupération des WalletTransaction',
        )
        .response(null);
    }

  }

}
