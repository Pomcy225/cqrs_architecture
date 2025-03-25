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
import { CreateGrilleTarifaireDto } from '../dto/create-grille-tarifaire.dto';
import { GrilleTarifaireService } from '../Service/grille-tarifaire.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('loyalty')
@Controller('loyalty/grille-tarifaire')
export class GrilleTarifaireController {
  constructor(
    private readonly grilleTarifaireService: GrilleTarifaireService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.grilleTarifaireService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Créer une grille tarifaire
  @Post('create')
  async create(@Body() createDto: CreateGrilleTarifaireDto) {
    try {
      const data = await this.grilleTarifaireService.create(createDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED)
        .setMessage('Grille tarifaire created successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Récupérer une grille tarifaire par ID
  @Get('show/:id')
  async getOne(@Param('id') id: string) {
    try {
      const data = await this.grilleTarifaireService.getOne(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Grille tarifaire found successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Mettre à jour une grille tarifaire
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateDto: CreateGrilleTarifaireDto) {
    try {
      const data = await this.grilleTarifaireService.update(+id, updateDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Grille tarifaire updated successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Supprimer une grille tarifaire
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      const data = await this.grilleTarifaireService.delete(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Grille tarifaire deleted successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
