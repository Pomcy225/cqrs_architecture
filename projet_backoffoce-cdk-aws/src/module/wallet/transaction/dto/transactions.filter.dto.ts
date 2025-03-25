import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class TransactionsFilterDto {
  @ApiProperty({
    description: 'Date de debut',
    type: String,
    example: '2023-01-01',
    required: false,
  })
  @IsDateString()
  dateDebut?: string;
  @ApiProperty({
    description: 'Date fin',
    type: String,
    example: '2023-01-01',
    required: false,
  })
  @IsDateString()
  dateFin?: string;
  @ApiProperty({
    description: 'Type de transaction',
    type: String,
    example: 'débit',
    required: false,
  })
  @IsString()
  type?: string;
  @ApiProperty({
    description: 'Numéro de transaction',
    type: String,
    example: '123456',
    required: false,
  })
  @IsString()
  numero?: string;
}
