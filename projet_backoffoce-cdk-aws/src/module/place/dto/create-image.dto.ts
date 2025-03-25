import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    description: 'image de la place',
    type: String,
    example: "url de l'image",
  })
  image_url: string;

  @ApiProperty({
    description: 'la date de creation de l image',
    type: String,
    example: '2022-01-01:00:00:00z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'id de la place',
    type: Number,
    example: 11,
  })
  @IsNumber()
  place_id: number;
}
