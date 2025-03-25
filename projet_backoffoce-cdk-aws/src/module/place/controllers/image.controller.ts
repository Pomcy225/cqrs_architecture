import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ImageService } from "../services/image.service";
import { CreateImageDto } from "../dto/create-image.dto";
import { ApiResponseService } from "src/utils/response_api/api_response_service";
import { PaginationDto } from "src/utils/response_api/dto/pagination_dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('place')
@Controller('place/image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const data = await this.imageService.findAll(paginationDto);
      return data;
    } catch (error) {
      return this.apiResponseService
        .setStatusCode(HttpStatus.BAD_REQUEST)
        .setMessage(error.message)
        .response(null);
    }
  }
  @Post('create')
  async create(@Body() createImageDto: CreateImageDto): Promise<any> {
    try {
      const data = await this.imageService.create(createImageDto);
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
      const data = await this.imageService.getOne(id);
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
  async update(@Param('id') id: number, @Body() image: CreateImageDto): Promise<any> {
    try {
      const data = await this.imageService.update(id, image);
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
      const data = await this.imageService.delete(id);
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
