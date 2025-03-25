import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreatePharmacieDto } from '../dto/create-pharmacie.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class PharmacieService {
  constructor(private dbUtil: DBUtil) {}

  // Récupérer toutes les pharmacies
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `
      SELECT
      pharmacie.*,
      ville.libelle AS ville_libelle
      FROM pharmacie 
      LEFT JOIN ville ON pharmacie.ville_id = ville.id
      ORDER BY pharmacie.id DESC`;

    const data = await this.dbUtil.placeServiceQuery(query);

    if (!data.rows.length) {
      throw new HttpException('No pharmacies found', HttpStatus.NOT_FOUND);
    }

    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
      nom_pharmacien: row.nom_pharmacien,
      tel1: row.tel1,
      tel2: row.tel2,
      tel3: row.tel3,
      latitude: row.latitude,
      longitude: row.longitude,
      ville: {
        id: row.ville_id,
        libelle: row.ville_libelle,
      },
    }));

    return paginate(formattedData, page, limit);
  }

  // Créer une nouvelle pharmacie
  async create(pharmacie: CreatePharmacieDto): Promise<any> {
    const query = `
      INSERT INTO pharmacie (
        libelle, 
        nom_pharmacien, 
        tel1, 
        tel2, 
        tel3, 
        latitude, 
        longitude, 
        ville_id, 
        date_debut_garde, 
        date_fin_garde
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`;

    const params = [
      pharmacie.libelle,
      pharmacie.nom_pharmacien,
      pharmacie.tel1,
      pharmacie.tel2,
      pharmacie.tel3,
      pharmacie.latitude,
      pharmacie.longitude,
      pharmacie.ville_id,
      pharmacie.date_debut_garde,
      pharmacie.date_fin_garde,
    ];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        'Failed to create pharmacy',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data.rows[0];
  }

  // Récupérer une pharmacie par son ID
  async getOne(id: number): Promise<any> {
    const query = `
      SELECT
      pharmacie.*,
      ville.libelle AS ville_libelle
      FROM pharmacie 
      LEFT JOIN ville  ON
      pharmacie.ville_id = ville.id
      WHERE pharmacie.id = $1`;

    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Pharmacy with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const row = data.rows[0];
    return {
      id: row.id,
      libelle: row.libelle,
      nom_pharmacien: row.nom_pharmacien,
      tel1: row.tel1,
      tel2: row.tel2,
      tel3: row.tel3,
      latitude: row.latitude,
      longitude: row.longitude,
      ville: {
        id: row.ville_id,
        libelle: row.ville_libelle,
      },
    };
  }

  // Mettre à jour une pharmacie
  async update(id: number, pharmacie: any): Promise<any> {
    const query = `
      UPDATE pharmacie 
      SET libelle = $1, 
          nom_pharmacien = $2, 
          tel1 = $3, 
          tel2 = $4, 
          tel3 = $5, 
          latitude = $6, 
          longitude = $7, 
          ville_id = $8, 
          date_debut_garde = $9, 
          date_fin_garde = $10
      WHERE id = $11 
      RETURNING *`;

    const params = [
      pharmacie.libelle,
      pharmacie.nom_pharmacien,
      pharmacie.tel1,
      pharmacie.tel2,
      pharmacie.tel3,
      pharmacie.latitude,
      pharmacie.longitude,
      pharmacie.ville_id,
      pharmacie.date_debut_garde,
      pharmacie.date_fin_garde,
      id,
    ];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Pharmacy with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data.rows[0];
  }

  // Supprimer une pharmacie
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM pharmacie WHERE id = $1 RETURNING *`;
    const params = [id];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Pharmacy with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data.rows[0];
  }
}
