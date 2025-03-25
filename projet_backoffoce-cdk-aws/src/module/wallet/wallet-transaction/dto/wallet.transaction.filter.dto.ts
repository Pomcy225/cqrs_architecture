import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class WalletTransactionFilterDto {
  @ApiProperty({
    description: 'Date de debut',
    type: String,
    example: '2025-03-05T16:37:42.439Z',
    required: false,
  })
  @IsDateString()
  dateDebut?: string;
  @ApiProperty({
    description: 'Date fin',
    type: String,
    example: '2025-03-05T16:37:42.439Z',
    required: false,
  })
  @IsDateString()
  dateFin?: string;
  @ApiProperty({
    description: 'wallet id',
    type: Number,
    example: 8,
    required: false,
  })
  @IsString()
  walletId?: string;
}
