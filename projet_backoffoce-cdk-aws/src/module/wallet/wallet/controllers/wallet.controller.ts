import { Controller, Get, Query, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { WalletService } from '../service/wallet.service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';

@ApiTags('Wallet ')
@Controller('/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get(':userId')
  async getOne(@Param('userId') userId: string) {
    try {
      const data = await this.walletService.getOne(userId);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Liste des Wallet  recuperée')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          error.message || 'Erreur lors de la récupération des Wallet',
        )
        .response(null);
    }
  }
}
