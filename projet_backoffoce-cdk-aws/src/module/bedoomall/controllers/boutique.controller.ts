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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BoutiqueService } from '../services/boutique.service';
import { CreateBoutiqueDto, UpdateBoutiqueDto } from '../dto/create-boutique.dto';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';

@ApiTags('bedoomall')
@Controller('mall/boutique')
export class BoutiqueController {
  constructor(
    private readonly boutiqueService: BoutiqueService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les boutiques avec pagination' })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.boutiqueService.findAll(paginationDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Boutiques récupérées avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          `Erreur lors de la récupération des boutiques : ${error.message}`,
        )
        .response(null);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Créer une boutique' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createBoutiqueDto: CreateBoutiqueDto) {
    try {
      const data = await this.boutiqueService.create(createBoutiqueDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.CREATED)
        .setMessage('Boutique créée avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(`Erreur de création : ${error.message}`)
        .response(null);
    }
  }

  @Get('show/:id')
  @ApiOperation({ summary: 'Récupérer une boutique par ID' })
  async getOne(@Param('id') id: string) {
    try {
      const data = await this.boutiqueService.getOne(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Boutique avec l'ID ${id} récupérée avec succès`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          `Erreur lors de la récupération de la boutique : ${error.message}`,
        )
        .response(null);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Mettre à jour une boutique' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() updateData: UpdateBoutiqueDto) {
    try {
      const data = await this.boutiqueService.update(+id, updateData);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Boutique avec l'ID ${id} mise à jour avec succès`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(`Erreur lors de la mise à jour : ${error.message}`)
        .response(null);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Supprimer une boutique' })
  async delete(@Param('id') id: string) {
    try {
      const deletedData = await this.boutiqueService.delete(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Boutique avec l'ID ${id} supprimée avec succès`)
        .response(deletedData);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(`Erreur lors de la suppression : ${error.message}`)
        .response(null);
    }
  }

  @Get('toggle-status/:id')
  @ApiOperation({ summary: "Changer le statut d'une boutique" })
  async toggleStatus(@Param('id') id: string) {
    try {
      const data = await this.boutiqueService.toggleStatus(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage(`Statut de la boutique avec l'ID ${id} modifié avec succès`)
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(`Erreur lors du changement de statut : ${error.message}`)
        .response(null);
    }
  }
}
