
import { ApiProperty } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'La description du ticket',
    type: String,
    example: 'description-test-123',
  })
  description?: string;
  @ApiProperty({
    description: 'Le libelle du ticket',
    type: String,
    example: '',
  })
  created_at?: string;
  @ApiProperty({
    description: 'Le libelle du ticket',
    type: String,
    example: 'ticket-test-123',
  })
  libelle?: string;

  @ApiProperty({
    description: 'Le libelle du ticket',
    type: String,
    example: 'ticket-test-123',
  })
  transaction_id?: string;

  @ApiProperty({
    description: 'La priorite du ticket',
    type: String,
    example: 'high',
  })
  priorite?: string;

  @ApiProperty({
    description: 'Le type de reclamation du ticket',
    type: String,
    example: 'transaction',
  })
  type_reclamation?: string;
  @ApiProperty({
    description: 'Le numero du ticket',
    type: String,
    example: '123456',
  })
  numero?: string;
  @ApiProperty({
    description: 'Le nom emetant du ticket',
    type: String,
  })
  nom?: string;
  @ApiProperty({
    description: 'Le prenom emetant du ticket',
    type: String,
  })
  prenom?: string;
}
