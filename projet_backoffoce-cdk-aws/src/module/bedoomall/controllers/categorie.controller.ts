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
import { CategorieService } from '../services/categorie.service';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('bedoomall')
@Controller('mall/categorie')
export class CategorieController {
  constructor(
    private readonly categorieService: CategorieService,
    private readonly apiResponseService: ApiResponseService,
  ) {}
  @Get()
 async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.categorieService.findAll(paginationDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Données récupérées avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
  @Post('create')
 async create(@Body() createCategorieDto: CreateCategorieDto) {
    try {
      const data = await this.categorieService.create(createCategorieDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED) // Code 201 pour création
        .setMessage('Données créées avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Get('show/:id')
async  getOne(@Param('id') id: string) {
    try {
      const data = await this.categorieService.getOne(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Données récupérées avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Put('update/:id')
async  update(@Param('id') id: string, @Body() updateData: CreateCategorieDto) {
    try {
      const data = await this.categorieService.update(+id, updateData);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Données à jour avec sucees')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  @Delete('delete/:id')
 async delete(@Param('id') id: string) {
    try {
      const data = await this.categorieService.delete(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Données à supprimer avec sucees')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
