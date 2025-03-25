import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentaireDto {
  @ApiProperty({
    description: "L'id de l'utilisateur",
    type: String,
    example: 'dgd-dgdg-dgdg',
  })
  @IsNumber()
  user_id: string;
  @ApiProperty({
    description: 'Le commentaire',
    type: String,
    example: 'libelle commentaire',
  })
  comment?: string;
  @ApiProperty({
    description: 'Le statut du commentaire',
    type: String,
    example: 'true',
  })
  @IsBoolean()
  statut: boolean;
  @ApiProperty({
    description: 'Le rating du commentaire',
    type: String,
    example: '5',
  })
  @IsNumber()
  rating: string;
  @ApiProperty({
    description: 'Le place_id du commentaire',
    type: Number,
    example: 11,
  })
  @IsNumber()
  place_id: number;
}
