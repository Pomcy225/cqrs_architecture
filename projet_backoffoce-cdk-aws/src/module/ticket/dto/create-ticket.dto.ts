import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsBoolean, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'Le id ne doit contenir que des lettres' })
  id: string;
  @ApiProperty({
    description: 'Le libelle du ticket',
    type: String,
    example: 'ticket-test-123',
  })
  @IsString({ message: 'Le libelle ne doit contenir que des lettres' })
  libelle?: string;

  @ApiProperty({
    description: 'La description du ticket',
    type: String,
    example: 'description-test-123',
  })
  @IsString({ message: 'decription que des lettres' })
  description?: string;
  @IsString({ message: 'Le created_at ne doit contenir que des lettres' })
  created_at: string;
  @ApiProperty({
    description: 'Le id de la transaction',
    type: String,
    example: 'transaction-test-123',
  })
  @IsString({ message: ' id de la transaction' })
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
