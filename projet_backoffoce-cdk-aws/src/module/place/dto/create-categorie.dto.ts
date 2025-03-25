import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoriePlaceDto {
  @ApiProperty({
    description: 'Le nom de la categorie',
    type: String,
    example: '100.5',
  })
  libelle: string;
  @ApiProperty({
    description: 'icon de la categorie',
    type: String,
    example: 'icon',
  })
  icon_url: string;
}
