import { Injectable, NotFoundException } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateImageDto } from '../dto/create-image.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class ImageService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto; // Valeurs par défaut

    const query = `
      SELECT
      image.*,

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
      FROM image 
      LEFT JOIN place 
        ON image.place_id = place.id
      ORDER BY image.id DESC`;

    const data = await this.dbUtil.placeServiceQuery(query);

    if (!data.rows.length) {
      throw new NotFoundException('No images found');
    }

    const formattedData = data.rows.map((row) => ({
      id: row.id,
      image_url: row.image_url,
      place_id: row.place_id,
      createdAt: row.createdat,
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

  async create(image: CreateImageDto): Promise<any> {
    const createdAt = new Date();

    const query = `
      INSERT INTO image (image_url, place_id, createdAt) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const params = [image.image_url, image.place_id, createdAt];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new Error('Failed to create image');
    }

    return data.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `
      SELECT 
      image.*,
     
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
      FROM image 
      LEFT JOIN place 
        ON image.place_id = place.id
      WHERE image.id = $1`;
    const params = [id];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    const row = data.rows[0];
    return {
      id: row.id,
      image_url: row.image_url,
      place_id: row.place_id,
      createdAt: row.createdat,
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

  async update(id: number, image: any): Promise<any> {
    const query = `
      UPDATE image 
      SET image_url = $1, place_id = $2 
      WHERE id = $3 
      RETURNING *`;
    const params = [image.image_url, image.place_id, id];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new NotFoundException(`Failed to update image with ID ${id}`);
    }

    return data.rows[0];
  }

  async delete(id: number): Promise<any> {
    const query = `DELETE FROM image WHERE id = $1 RETURNING *`;
    const params = [id];

    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (!data.rows.length) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return data.rows[0];
  }
}
