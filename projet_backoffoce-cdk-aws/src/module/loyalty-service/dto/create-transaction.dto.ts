import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsDate, IsNotEmpty, MaxLength, IsInt } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Identifiant utilisateur', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  user_id: string;

  @ApiProperty({ description: 'Code du service', example: 'service001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  service_code: string;

  @ApiProperty({
    description: 'Nom du service',
    example: 'Paiement de facture',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  service_nom: string;

  @ApiProperty({ description: 'Type de transaction', example: 'débit' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  type_transaction: string;

  @ApiProperty({
    description: 'Date de la transaction',
    example: '2025-01-01T12:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  date_transaction: Date;

  @ApiProperty({ description: 'Montant de la transaction', example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  montant: number;

  @ApiProperty({ description: 'Identifiant du compte lié', example: 1 })
  @IsInt()
  account_id: number;
}

export class UpdateTransactionDto {
  @ApiProperty({ description: 'Identifiant utilisateur', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  user_id: string;

  @ApiProperty({ description: 'Code du service', example: 'service001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  service_code: string;

  @ApiProperty({
    description: 'Nom du service',
    example: 'Paiement de facture',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  service_nom: string;

  @ApiProperty({ description: 'Type de transaction', example: 'débit' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  type_transaction: string;

  @ApiProperty({
    description: 'Date de la transaction',
    example: '2025-01-01T12:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  date_transaction: Date;

  @ApiProperty({ description: 'Montant de la transaction', example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  montant: number;

  @ApiProperty({ description: 'Identifiant du compte lié', example: 1 })
  @IsInt()
  account_id: number;
}
