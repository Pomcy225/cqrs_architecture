import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { CommandeService } from '../services/commande.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('bedoomall')
@Controller('mall/commande')
export class CommandeController {
  constructor(
    private readonly commandeService: CommandeService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.commandeService.findAll(paginationDto);
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

  // Récupérer une commande et ses éléments par ID
  @Get('show/:id')
  async getOne(@Param('id') id: string) {
    try {
      const data = await this.commandeService.getOne(+id);
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
}
