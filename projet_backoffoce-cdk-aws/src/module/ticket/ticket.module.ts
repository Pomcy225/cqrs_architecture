import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DBUtil } from 'src/utils/db-utils';

@Module({
  controllers: [TicketController],
  providers: [TicketService, DBUtil],
})
export class TicketModule {}
