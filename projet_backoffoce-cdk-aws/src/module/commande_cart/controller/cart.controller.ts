import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { CartService } from '../service/carte.servive';
import { CommandeCarteDto } from '../dto/Commande.Carte.dto';

@ApiTags('commande carte')
@Controller('commande/carte')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les commandes de cartes avec pagination',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.cartService.findAll(paginationDto);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Commandes de cartes récupérées avec succès')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(
          `Erreur lors de la récupération des commandes de cartes : ${error.message}`,
        )
        .response(null);
    }
  }
  @Put('update/livraison/:id')
    async update(@Param('id') id: number  , @Body() commandeCarteDto: CommandeCarteDto): Promise<any> {
      try {
        const data = await this.cartService.update(id, commandeCarteDto);
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
      const data = await this.cartService.delete(id);
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
