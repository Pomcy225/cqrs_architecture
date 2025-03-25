import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateLivreurDto } from '../dto/create-livreur.dto';
import { LivreurService } from '../services/livreur.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('livraison')
@Controller('livraison/livreurs')
export class LivreurController {
  constructor(
    private readonly LivreurService: LivreurService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.LivreurService.findAll(paginationDto);
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
  @Post('create')
  async create(
    @Body() createCategorieDto: CreateLivreurDto,
  ): Promise<any> {
    try {
      const data = await this.LivreurService.create(createCategorieDto);
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

  @Get('without-pagination')
  async findAllWithoutPagination() {
    try {
      const data = await this.LivreurService.findAllWithoutPagination();
      return data;
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
      const data = await this.LivreurService.getOne(id);
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

  @Get('show/by/compte/:id')
  async getOneByCompte(@Param('id') id: string): Promise<any> {
    try {
      const data = await this.LivreurService.getOneByCompte(id);
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
  async update(
    @Param('id') id: number,
    @Body() categorieData: CreateLivreurDto,
  ): Promise<any> {
    try {
      const data = await this.LivreurService.update(id, categorieData);
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
      const data = await this.LivreurService.delete(id);
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
