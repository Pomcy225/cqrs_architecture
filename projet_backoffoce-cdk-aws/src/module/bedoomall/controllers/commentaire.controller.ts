import { Controller, Get, Patch, Param, Query, HttpStatus, Put } from '@nestjs/common';
import { CommentaireService } from '../services/commentaire.service';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('bedoomall')
@Controller('mall/commentaire')
export class CommentaireController {
  constructor(
    private readonly commentaireService: CommentaireService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  // Récupérer tous les commentaires
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.commentaireService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }

  // Inverser le statut d'un commentaire
  @Put('toggle-status/:id')
  async toggleStatus(@Param('id') id: string) {
    try {
      const data = await this.commentaireService.toggleStatus(+id);
      return this.apiResponseService
        .setStatusCode(HttpStatus.OK)
        .setMessage('Commentaire status toggled successfully')
        .response(data);
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
}
