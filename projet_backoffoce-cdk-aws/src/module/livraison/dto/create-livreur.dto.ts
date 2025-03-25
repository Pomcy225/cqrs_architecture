import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLivreurDto {
  @ApiProperty({
    description: 'Le nom du livreur',
    type: String,
    example: 'konate',
  })
  nom: string;
  @ApiProperty({
    description: 'le prenom du livreur',
    type: String,
    example: 'Hamed',
  })
  prenoms: string;

  @ApiProperty({
    description: 'le télephone du livreur',
    type: String,
    example: '0778887541',
  })
  telephone: string;

  @ApiProperty({
    description: 'le télephone du livreur',
    type: String,
    example: '88',
  })
  compte: string;
}
