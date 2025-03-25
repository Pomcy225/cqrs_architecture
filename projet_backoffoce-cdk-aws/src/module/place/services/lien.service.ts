import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateLienDto } from '../dto/create-lien.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class LienService {
  constructor(private dbUtil: DBUtil) {}

  // Récupérer tous les liens
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto; // Valeurs par défaut

    const query = `
      SELECT
      lien.*,
 
        place.libelle AS place_libelle,
        place.description_place AS place_description_place,
        place.addresse AS place_addresse,
        place.latitude AS place_latitude,
        place.longitude AS place_longitude,
        place.createdAt AS place_createdAt,
        place.updatedAt AS place_updatedAt,
        place.statut AS place_statut,
        place.tel1 AS place_tel1,
        place.tel2 AS place_tel2,
        place.user_id AS place_user_id,
        place.categorie_id AS place_categorie_id
      FROM lien 
       LEFT JOIN place 
        ON lien.place_id = place.id
      ORDER BY lien.id DESC`;

    const data = await this.dbUtil.placeServiceQuery(query);

    if (!data.rows.length) {
      throw new HttpException('No liens found', HttpStatus.NOT_FOUND);
    }

    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
      social_url: row.social_url,
      place: {
        id: row.place_id,
        libelle: row.place_libelle,
        description_place: row.place_description_place,
        addresse: row.place_addresse,
        latitude: row.place_latitude,
        longitude: row.place_longitude,
        createdAt: row.place_createdAt,
        updatedAt: row.place_updatedAt,
        statut: row.place_statut,
        tel1: row.place_tel1,
        tel2: row.place_tel2,
        user_id: row.place_user_id,
        categorie_id: row.place_categorie_id,
      },
    }));

    return paginate(formattedData, page, limit);
  }

  // Récupérer un lien par son ID
  async getOne(id: number): Promise<any> {
    const query = `
      SELECT
      lien.*,
    
        place.libelle AS place_libelle,
        place.description_place AS place_description_place,
        place.addresse AS place_addresse,
        place.latitude AS place_latitude,
        place.longitude AS place_longitude,
        place.createdAt AS place_createdAt,
        place.updatedAt AS place_updatedAt,
        place.statut AS place_statut,
        place.tel1 AS place_tel1,
        place.tel2 AS place_tel2,
        place.user_id AS place_user_id,
        place.categorie_id AS place_categorie_id
      FROM lien 
      LEFT JOIN place
        ON lien.place_id = place.id
      WHERE lien.id = $1`;

    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Lien with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const row = data.rows[0];
    return {
      id: row.id,
      libelle: row.libelle,
      social_url: row.social_url,
      place: {
        id: row.place_id,
        libelle: row.place_libelle,
        description_place: row.place_description_place,
        addresse: row.place_addresse,
        latitude: row.place_latitude,
        longitude: row.place_longitude,
        createdAt: row.place_createdAt,
        updatedAt: row.place_updatedAt,
        statut: row.place_statut,
        tel1: row.place_tel1,
        tel2: row.place_tel2,
        user_id: row.place_user_id,
        categorie_id: row.place_categorie_id,
      },
    };
  }

  // Créer un lien
  async create(lien: CreateLienDto): Promise<any> {
    const query = `
      INSERT INTO lien (libelle, social_url, place_id) 
      VALUES ($1, $2, $3) 
      RETURNING *`;

    const params = [lien.libelle, lien.social_url, lien.place_id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        'Failed to create lien',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data.rows[0];
  }

  // Mettre à jour un lien
  async update(id: number, lien: any): Promise<any> {
    const query = `
      UPDATE lien 
      SET libelle = $1, social_url = $2, place_id = $3 
      WHERE id = $4 
      RETURNING *`;

    const params = [lien.libelle, lien.social_url, lien.place_id, id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Lien with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data.rows[0];
  }

  // Supprimer un lien
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM lien WHERE id = $1 RETURNING *`;
    const params = [id];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Lien with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data.rows[0];
  }
}
