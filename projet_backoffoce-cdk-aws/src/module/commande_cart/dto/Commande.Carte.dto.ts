import { ApiProperty } from "@nestjs/swagger";

export class CommandeCarteDto {


@ApiProperty({
    description: "Date de livraison",
    type: String,
    example: '2023-01-01 12:00:00',
  })
  date_livraison?: Date; // Facultatif
 @ApiProperty({
    description: "Nom du livreur",
    type: String,
    example: 'John Doe',
 })
  nom_livreur?: string;

  @ApiProperty({
    description: "Numéro de tel du livreur",
    type: String,
    example: '1234567890',
  })
  tel_livreur?: string;


  @ApiProperty({
    description: "Date de remise de la carte",
    type: String,
    example: '2023-01-01 12:00:00',
  })

  date_remise_carte?: Date;

}
