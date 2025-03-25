import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDispatchDto {
  @ApiProperty({
    description: 'Le nom du livreur',
    type: String,
    example: 'konate',
  })
  livreur_id: string;

  @ApiProperty({
    description: 'La commande',
    type: String,
    example: ['88', '89', '90'],
  })
  commande_carte_id: string[];
}

