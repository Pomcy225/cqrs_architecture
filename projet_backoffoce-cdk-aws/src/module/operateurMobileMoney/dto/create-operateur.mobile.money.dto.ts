import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOperateurMobileMoneyDto {
  @ApiProperty({
    description: "code de l'Operateur Mobile Money",
    type: String,
    example: 'test-123',
  })
  @IsNumber()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: "Le libelle de l'Operateur Mobile Money",
    type: String,
    example: 'ORANGE',
  })
  libelle: string;
  @ApiProperty({
    description: "status de l'Operateur Mobile Money",
    type: String,
    example: 'inactive',
  })
  status: string;
}
