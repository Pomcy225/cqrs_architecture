import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateGrilleTarifaireDto {
  @ApiProperty({ description: 'Date début', example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  date_debut: string;

  @ApiProperty({ description: 'Date fin', example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  date_fin: string;

  @ApiProperty({ description: 'Montant', example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  montant: number;

  @ApiProperty({ description: 'Nombre de points attribués', example: 10 })
  @IsInt()
  @IsNotEmpty()
  point: number;
}

export class UpdateGrilleTarifaireDto {
  @ApiProperty({ description: 'Montant de début', example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  montant: number;
  @ApiProperty({ description: 'Date début', example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  date_debut: string;

  @ApiProperty({ description: 'Date fin', example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  date_fin: string;

  @ApiProperty({ description: 'Nombre de points attribués', example: 10 })
  @IsInt()
  @IsNotEmpty()
  point: number;
}
