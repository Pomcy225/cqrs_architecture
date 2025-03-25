import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AccountService } from '../Service/account.service';
import { CreateAccountDto } from '../dto/create-account.dto';

import { Account } from '../entities/account.entity';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('loyalty')
@Controller('loyalty/account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.accountService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
  // Créer un compte
  @Post('create')
  async create(@Body() createDto: CreateAccountDto) {
    try {
      const data = await this.accountService.create(createDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED)
        .setMessage('Account created successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Récupérer un compte par ID
  @Get('show/:id')
  async getOne(@Param('id') id: string) {
    try {
      const data = await this.accountService.getOne(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Account with ID ${id} fetched successfully`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Mettre à jour un compte
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateDto: CreateAccountDto) {
    try {
      const data = await this.accountService.update(+id, updateDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Account with ID ${id} updated successfully`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Supprimer un compte
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      const data = await this.accountService.delete(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Account with ID ${id} deleted successfully`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Get('toggle-status/:id')
  async toggleStatus(@Param('id') id: number) {
    try {
      const data = await this.accountService.toggleStatus(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Account with ID ${id} updated successfully`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Get('transactions/account/:id')
  async getTransactionsForAccount(@Param('id') id:number) {
     try {
      const data = await this.accountService.transactionAccount(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Account with ID ${id}  successfully`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
