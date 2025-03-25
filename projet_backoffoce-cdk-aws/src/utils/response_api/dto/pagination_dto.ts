import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
export class PaginationDto {
  @ApiProperty({
    description: 'page courante',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
  @ApiProperty({
    description: 'nombre de ligne par page',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}