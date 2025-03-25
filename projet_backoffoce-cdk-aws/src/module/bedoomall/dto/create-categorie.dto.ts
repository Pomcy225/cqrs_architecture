import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategorieDto {
  @ApiProperty({
    description: 'Le nom de la categorie',
    example: 'Ma categorie',
  })
  libelle: string;
  @ApiProperty({
    description: 'icon de la categorie',
    example: 'user-icon',
  })
  icon?: string;
}
