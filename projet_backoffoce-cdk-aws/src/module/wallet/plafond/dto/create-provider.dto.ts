import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    description: 'Le libelle de la plafond',
    type: String,
    example: 'Libelle plafond',
  })
  libelle: string;
  @ApiProperty({
    description: 'Le code de la plafond',
    type: String,
    example: 'tst-3467',
  })
  code: string;
}
