import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlafondDto {
  @ApiProperty({
    description: 'Le montant du plafond',
    type: Number,
    example: 120,
  })
  @IsNumber()
  montant: string;
  @ApiProperty({
    description: 'Le type de plafond',
    type: String,
    example: 'Plafond',
  })
  type_plafond: string;
  @ApiProperty({
    description: 'Le provider_id',
    type: Number,
    example: 3,
  })
  provider_id: number;
  @ApiProperty({
    description: ' Le type_service_id',
    type: Number,
    example: 100,
  })
  type_service_id: number;
  @ApiProperty({
    description: ' Le type_action_id',
    type: Number,
    example: 100,
  })
  type_action_id: number;
  @ApiProperty({
    description: ' Le createdAt',
    type: Date,
    example: '2023-01-01:00:00:00z',
  })
  createdAt: Date;
  @ApiProperty({
    description: ' Le updatedAt',
    type: Date,
    example: '2023-01-01:00:00:00z',
  })
  updatedAt: Date;
  @ApiProperty({
    description: ' Le deletedAt',
    type: Date,
    example: '2023-01-01:00:00:00z',
  })
  deletedAt: Date;
}
