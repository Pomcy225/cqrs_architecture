import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OperateurAirtimeService } from '../services/operateur.airtime.service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { CreateOperateurAirtimeDto } from '../dto/create-operateur.airtime.dto';

@Controller('operateurs')
export class OperateurAirtimeController {
  apiResponseService: any;
  constructor(
    private readonly serviceOperateurAirtime: OperateurAirtimeService,
  ) {}

  @Get()
  async getAll(@Query() paginationDto: PaginationDto): Promise<any> {
    try {
      const data = await this.serviceOperateurAirtime.findAll(paginationDto); // Valeurs par défaut

      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Put(':id/status')
  async toggleStatus(@Param('id') id: string) {
    const data = await this.serviceOperateurAirtime.toggleStatus(id);
    return data;
  }
}
