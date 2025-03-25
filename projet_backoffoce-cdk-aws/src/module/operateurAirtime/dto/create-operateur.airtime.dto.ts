import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOperateurAirtimeDto {
  @ApiProperty({
    description: "code de l'OperateurAirtime",
    type: String,
    example: 'test-123',
  })
  @IsNumber()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "Le libelle de l'OperateurAirtime",
    type: String,
    example: 'ORANGE',
  })
  libelle: string;
  @ApiProperty({
    description: "status de l'OperateurAirtime",
    type: String,
    example: 'inactive',
  })
  status: string;
}
