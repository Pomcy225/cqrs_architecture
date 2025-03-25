import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoutiqueDto {
  @ApiProperty({
    description: 'Le nom de la boutique',
    example: 'Ma Boutique',
  })
  libelle: string;

  @ApiProperty({
    description: 'Nombre de ventes effectuées par la boutique',
    example: '120',
  })
  nbre_vente: string;

  @ApiPropertyOptional({
    description: 'Latitude de la boutique',
    example: '5.3456',
  })
  latitude?: string;

  @ApiPropertyOptional({
    description: 'Longitude de la boutique',
    example: '-3.4567',
  })
  longitude?: string;

  @ApiProperty({
    description: 'Numéro de téléphone de la boutique',
    example: '+2250123456789',
  })
  tel: string;

  @ApiProperty({
    description: 'Adresse email de la boutique',
    example: 'contact@maboutique.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'URL du logo de la boutique',
    example: 'https://example.com/logo.png',
  })
  logo?: string;

  @ApiPropertyOptional({
    description: 'numero de tel du user',
    example: '+2250123456789',
  })
  user_tel?: string;
}



export class UpdateBoutiqueDto {
  @ApiProperty({
    description: 'Le nom de la boutique',
    example: 'Ma Boutique',
  })
  libelle: string;

  @ApiProperty({
    description: 'Nombre de ventes effectuées par la boutique',
    example: '120',
  })
  nbre_vente: string;

  @ApiPropertyOptional({
    description: 'Latitude de la boutique',
    example: '5.3456',
  })
  latitude?: string;

  @ApiPropertyOptional({
    description: 'Longitude de la boutique',
    example: '-3.4567',
  })
  longitude?: string;

  @ApiProperty({
    description: 'Numéro de téléphone de la boutique',
    example: '+2250123456789',
  })
  tel: string;

  @ApiProperty({
    description: 'Adresse email de la boutique',
    example: 'contact@maboutique.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'URL du logo de la boutique',
    example: 'https://example.com/logo.png',
  })
  logo?: string;

  @ApiPropertyOptional({
    description: 'id du user',
    example: 'fkf-ddg-dkdl',
  })
  user_Id?: string;
}
