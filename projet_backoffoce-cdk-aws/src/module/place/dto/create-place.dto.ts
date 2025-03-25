import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Le libelle de la place',
    type: String,
    example: 'Libelle place',
  })
  libelle: string;
  @ApiProperty({
    description: 'Le description de la place',
    type: String,
    example: 'short description place',
  })
  description_place: string;
  @ApiProperty({
    description: 'adresse de la place',
    type: String,
    example: 'adresse place',
  })
  addresse: string;
  @ApiProperty({
    description: 'latitude de la place',
    type: String,
    example: 'latitude place',
  })
  latitude: string;
  @ApiProperty({
    description: 'Longitude de la place',
    type: String,
    example: 'longitude place',
  })
  longitude: string;
  @ApiProperty({
    description: 'Le statut de la place',
    type: String,
    example: 'true',
  })
  statut: string;
  @ApiProperty({
    description: 'Le numéro de téléphone 1',
    type: String,
    example: '+2250123456789',
  })
  tel1: string;
  @ApiProperty({
    description: 'Le numéro de téléphone 2',
    type: String,
    example: '+2250123456789',
  })
  tel2?: string;
  @ApiProperty({
    description: 'user_id',
    type: String,
    example: 'vubij',
  })
  user_id: string;
  @ApiProperty({
    description: 'categorie_id',
    type: Number,
    example: 1,
  })
  @IsNumber()
  categorie_id: number;
}
