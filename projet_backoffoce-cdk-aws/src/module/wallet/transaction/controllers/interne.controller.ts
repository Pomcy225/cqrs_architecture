import {
  Controller,
  Get,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { Interne } from '../entities/interne.entity';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { InterneService } from '../service/interne.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('plafonds transactions')
@Controller('wallet/transaction/Interne')
export class InterneController {
  constructor(
    private readonly interneService: InterneService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.interneService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
