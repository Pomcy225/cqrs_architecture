import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class PlaceService {
  constructor(private dbUtil: DBUtil) {}

  // Récupérer tous les lieux
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `
      SELECT p.*,  c.libelle AS categorie_libelle, c.icon_url AS categorie_icon_url
      FROM place AS p
      LEFT JOIN categorie AS c ON p.categorie_id = c.id
      ORDER BY p.id DESC`;

    const data = await this.dbUtil.placeServiceQuery(query);

    if (!data.rows.length) {
      throw new HttpException('No places found', HttpStatus.NOT_FOUND);
    }

    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
      description_place: row.description_place,
      addresse: row.addresse,
      latitude: row.latitude,
      longitude: row.longitude,
      statut: row.statut,
      tel1: row.tel1,
      tel2: row.tel2,
      user_id: row.user_id,
      categorie: {
        id: row.categorie_id,
        libelle: row.categorie_libelle,
        icon_url: row.categorie_icon_url,
      },
    }));

    return paginate(formattedData, page, limit);
  }

  // Créer un nouveau lieu
  async create(placeData: CreatePlaceDto): Promise<any> {
   const createdAt = new Date();
   const updatedAt = new Date();
    const query = `
      INSERT INTO place (
        libelle, description_place, addresse, latitude, longitude, statut, tel1, tel2, user_id, categorie_id ,createdAt,updatedAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)
      RETURNING *`;

    const params = [
      placeData.libelle,
      placeData.description_place,
      placeData.addresse,
      placeData.latitude,
      placeData.longitude,
      placeData.statut,
      placeData.tel1,
      placeData.tel2,
      placeData.user_id,
      placeData.categorie_id,
      createdAt,
      updatedAt
    ];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        'Failed to create place',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return data.rows[0];
  }

  // Récupérer un lieu par son ID
  async getOne(id: number): Promise<any> {
    const query = `
      SELECT p.*, c.libelle AS categorie_libelle, c.icon_url AS categorie_icon_url
      FROM place AS p
      LEFT JOIN categorie AS c ON p.categorie_id = c.id
      WHERE p.id = $1`;

    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Place with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const row = data.rows[0];
    return {
      id: row.id,
      libelle: row.libelle,
      description_place: row.description_place,
      addresse: row.addresse,
      latitude: row.latitude,
      longitude: row.longitude,
      statut: row.statut,
      tel1: row.tel1,
      tel2: row.tel2,
      user_id: row.user_id,
      categorie: {
        id: row.categorie_id,
        libelle: row.categorie_libelle,
        icon_url: row.categorie_icon_url,
      },
    };
  }

  // Mettre à jour un lieu
  async update(id: number, placeData: any): Promise<any> {

   const updatedAt = new Date();
    const query = `
      UPDATE place 
      SET libelle = $1, 
          description_place = $2, 
          addresse = $3, 
          latitude = $4, 
          longitude = $5, 
          statut = $6, 
          tel1 = $7, 
          tel2 = $8, 
          user_id = $9, 
          categorie_id = $10
      ,updatedAt = $11
      WHERE id = $12
      RETURNING *`;

    const params = [
      placeData.libelle,
      placeData.description_place,
      placeData.addresse,
      placeData.latitude,
      placeData.longitude,
      placeData.statut,
      placeData.tel1,
      placeData.tel2,
      placeData.user_id,
      placeData.categorie_id,
        updatedAt,
      id,
    
    ];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Place with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data.rows[0];
  }

  // Supprimer un lieu
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM place WHERE id = $1 RETURNING *`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new HttpException(
        `Place with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return data.rows[0];
  }
}
