import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';
import express, { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('ticket')
@Controller('/ticket')
export class TicketController {
  constructor(private readonly TicketService: TicketService) {}

  @Post('store')
  async create(@Body() createTicketDto: CreateTicketDto, @Res() res: Response) {
    try {
      const result = await this.TicketService.create(createTicketDto);

      return res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    return this.TicketService.create(createTicketDto);
  }

  @Get('all')
  findAll() {
    return this.TicketService.findAll();
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.TicketService.update(id, updateTicketDto);
  }
}
