import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTypeServiceDto {
  @ApiProperty({
    description: 'libelle de type service',
    type: String,
    example: 'Libelle type service',
  })
  libelle: string;
  @ApiProperty({
    description: 'code de type service',
    type: String,
    example: 'tst-3467',
  })
  code: string;
}
