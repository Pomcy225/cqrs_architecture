
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateConversionDto {
  @ApiProperty({ description: 'Nombre de points', example: 10 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  point: number;

 

  @ApiProperty({ description: 'Montant correspondant', example: 500 })
  @IsNumber()
  @IsNotEmpty()
  montant: number;
}

export class UpdateConversionDto {
  @ApiProperty({ description: 'Nombre  de points', example: 10 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  point: number;

  @ApiProperty({ description: 'Montant correspondant', example: 500 })
  @IsNumber()
  @IsNotEmpty()
  montant: number;
}
