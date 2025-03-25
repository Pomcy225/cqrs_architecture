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
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { CreateOperateurMobileMoneyDto } from '../dto/create-operateur.mobile.money.dto';
import { ServiceOperateurMobileMoney } from '../services/operateur.mobile.money.service';

@Controller('operateurs/Mobile/Money')
export class OperateurMobileMoneyController {
  apiResponseService: any;
  constructor(
    private readonly serviceOperateurMobileMoney: ServiceOperateurMobileMoney,
  ) {}



  @Get()
  async getAll(@Query() paginationDto: PaginationDto): Promise<any> {
    try {
      const data =
        await this.serviceOperateurMobileMoney.findAll(paginationDto); // Valeurs par défaut

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
    const data = await this.serviceOperateurMobileMoney.toggleStatus(id);
    return data;
  }
}
