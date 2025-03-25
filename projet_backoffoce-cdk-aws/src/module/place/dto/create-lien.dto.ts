import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLienDto {
  @ApiProperty({
    description: 'Le nom du lien',
    type: String,
    example: 'Lien',
  })
  libelle: string;
  @ApiProperty({
    description: 'Lien social',
    type: String,
    example: 'lien social',
  })
  social_url: string;
  @ApiProperty({
    description: 'id de la place',
    type: Number,
    example: 11,
  })
  place_id: number;
}
