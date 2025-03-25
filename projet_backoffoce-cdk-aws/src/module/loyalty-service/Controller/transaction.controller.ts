import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionService } from '../Service/transaction.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('loyalty')
@Controller('loyalty/transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.transactionService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Créer une transaction
  @Post('create')
  async create(@Body() createDto: CreateTransactionDto) {
    try {
      const data = await this.transactionService.create(createDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED)
        .setMessage('Transaction created successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Récupérer une transaction par ID
  @Get('show/:id')
  async getOne(@Param('id') id: string) {
    try {
      const data = await this.transactionService.getOne(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Transaction retrieved successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Mettre à jour une transaction
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateDto: CreateTransactionDto) {
    try {
      const data = await this.transactionService.update(+id, updateDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Transaction updated successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Supprimer une transaction
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      const data = await this.transactionService.delete(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Transaction deleted successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
