import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class CreatePharmacieDto {
  @ApiProperty({
    description: 'Le libelle de la pharmacie',
    type: String,
    example: 'Libelle pharmacie',
  })
  libelle: string;
  @ApiProperty({
    description: 'Le nom du pharmacien',
    type: String,
    example: 'Nom pharmacien',
  })
  nom_pharmacien?: string;
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
    description: 'Le numéro de téléphone 3',
    type: String,
    example: '+2250123456789',
  })
  tel3?: string;
  @ApiProperty({
    description: 'La latitude de la pharmacie',
    type: String,
    example: '245778',
  })
  @IsNumber()
  latitude: number;
  @ApiProperty({
    description: 'La longitude de la pharmacie',
    type: String,
    example: '245778',
  })
  @IsNumber()
  longitude: number;
  @ApiProperty({
    description: 'id de la ville',
    type: Number,
    example: 11,
  })
  @IsNumber()
  ville_id: number;
  @ApiProperty({
    description: 'La date de debut de la garde',
    type: String,
    example: '2022-01-01:00:00:00z',
  })
  @IsDate()
  date_debut_garde?: Date;
  @ApiProperty({
    description: 'La date de fin de la garde',
    type: String,
    example: '2022-01-01:00:00:00z',
  })
  @IsDate()
  date_fin_garde?: Date;
}
