import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { PharmacieService } from "../services/pharmacie.service";
import { CreatePharmacieDto } from "../dto/create-pharmacie.dto";
import { ApiResponseService } from "src/utils/response_api/api_response_service";
import { PaginationDto } from "src/utils/response_api/dto/pagination_dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('place')
@Controller('place/pharmacie')
export class PharmacieController {
  constructor(
    private readonly pharmacieService: PharmacieService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.pharmacieService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
  @Post('create')
  async create(@Body() createPharmacieDto: CreatePharmacieDto): Promise<any> {
    try {
      const data = await this.pharmacieService.create(createPharmacieDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED)
        .setMessage('created successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Get('show/:id')
  async getOne(@Param('id') id: number): Promise<any> {
    try {
      const data = await this.pharmacieService.getOne(id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('element found successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() pharmacieData: CreatePharmacieDto): Promise<any> {
    try {
      const data = await this.pharmacieService.update(id, pharmacieData);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('element updated successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<any> {
    try {
      const data = await this.pharmacieService.delete(id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('element deleted successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}