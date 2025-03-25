import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsInt } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ description: 'Identifiant utilisateur', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  user_id: string;

  @ApiProperty({ description: 'Statut du compte', example: 'true' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  statut: string;

  @ApiProperty({ description: 'Points accumulés', example: 50 })
  @IsInt()
  point: number;
}

export class UpdateAccountDto {
  @ApiProperty({ description: 'Identifiant utilisateur', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  user_id: string;

  @ApiProperty({ description: 'Statut du compte', example: 'active' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  statut: string;

  @ApiProperty({ description: 'Points accumulés', example: 75 })
  @IsInt()
  point: number;
}
