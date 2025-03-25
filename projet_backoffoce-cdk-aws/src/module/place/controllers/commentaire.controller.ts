import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { CommentaireService } from "../services/commentaire.service";
import { CreateCommentaireDto } from "../dto/create-commentaire";
import { ApiResponseService } from "src/utils/response_api/api_response_service";
import { PaginationDto } from "src/utils/response_api/dto/pagination_dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('place')
@Controller('place/commentaire')
export class CommentaireController {
  constructor(
    private readonly commentaireService: CommentaireService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

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
  @Post('create')
  async create(
    @Body() createCommentaireDto: CreateCommentaireDto,
  ): Promise<any> {
    try {
      const data = await this.commentaireService.create(createCommentaireDto);
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
      const data = await this.commentaireService.getOne(id);
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
    @Body() commentaireData: CreateCommentaireDto,
  ): Promise<any> {
    try {
      const data = await this.commentaireService.update(id, commentaireData);
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
      const data = await this.commentaireService.delete(id);
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
  @Put('toggle-status/:id')
  async toggleStatus(@Param('id') id: Number) {
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