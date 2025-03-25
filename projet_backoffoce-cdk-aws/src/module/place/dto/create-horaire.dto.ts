import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHoraireDto {
  @ApiProperty({
    description: 'Le jour de la semaine',
    type: String,
    example: 'Lundi',
  })
  jour: string;
  @ApiProperty({
    description: 'Le numéro du jour de la semaine',
    type: String,
    example: '1',
  })
  @IsNumber()
  jourNumber: number;
  @ApiProperty({
    description: 'Le type de pause',
    type: String,
    example: 'Matin',
  })
  debutPause?: string;
  @ApiProperty({
    description: 'Le type de pause',
    type: String,
    example: 'soir',
  })
  finPause?: string;
  @ApiProperty({
    description: 'debut',
    type: String,
    example: '08:00',
  })
  debut?: string;
  @ApiProperty({
    description: 'fin',
    type: String,
    example: '17:00',
  })
  fin?: string;
  @ApiProperty({
    description: 'Le id de la place',
    type: Number,
    example: 11,
  })
  @IsNumber()
  place_id: number;
}
