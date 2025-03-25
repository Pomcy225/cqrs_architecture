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

import { Externe } from '../entities/externe.entity';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ExterneService } from '../service/externe.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('plafonds transactions')
@Controller('wallet/transaction/externe')
export class ExterneController {
  constructor(
    private readonly externeService: ExterneService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.externeService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
