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
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateConversionDto } from '../dto/create-conversion.dto';
import { ConversionService } from '../Service/conversion.service';
@ApiTags('loyalty')
@Controller('loyalty/conversion')
export class ConversionController {
  constructor(
    private readonly conversionService: ConversionService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.conversionService.findAll(paginationDto);
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
  async create(@Body() createDto: CreateConversionDto) {
    try {
      const data = await this.conversionService.create(createDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED)
        .setMessage('Conversion created successfully')
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
      const data = await this.conversionService.getOne(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Conversion with ID ${id} fetched successfully`)
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
  async update(
    @Param('id') id: string,
    @Body() updateDto: CreateConversionDto,
  ) {
    try {
      const data = await this.conversionService.update(+id, updateDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Conversion with ID ${id} updated successfully`)
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
      const data = await this.conversionService.delete(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Conversion with ID ${id} deleted successfully`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

}
