import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVilleDto {
  @ApiProperty({
    description: 'Le libelle de la ville',
    type: String,
    example: 'Libelle ville',
  })
  libelle: string;
}
