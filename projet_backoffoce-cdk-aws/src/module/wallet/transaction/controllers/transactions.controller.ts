import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { TransactionsService } from '../service/transactions.service';
import { TransactionsFilterDto } from '../dto/transactions.filter.dto';

@ApiTags('plafonds transactions')
@Controller('wallet/transaction/Transaction')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filters: TransactionsFilterDto,
  ) {
    try {
      const data = await this.transactionsService.findAll(
        paginationDto,
        filters,
      );
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Liste des transactions récupérée avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          error.message || 'Erreur lors de la récupération des transactions',
        )
        .response(null);
    }
  }
}
