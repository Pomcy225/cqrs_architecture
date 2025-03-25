import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTypeActionDto {
  @ApiProperty({
    description: 'libelle de type action',
    type: String,
    example: 'Libelle type action',
  })
  libelle: string;
  @ApiProperty({
    description: 'code de type action',
    type: String,
    example: 'tst-3467',
  })
  code: string;
}
