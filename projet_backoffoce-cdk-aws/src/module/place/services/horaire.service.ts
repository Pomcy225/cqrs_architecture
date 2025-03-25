import { Injectable, NotFoundException } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateHoraireDto } from '../dto/create-horaire.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class HoraireService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `
      SELECT 
        horaire.*, 
      
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
      FROM horaire 
      LEFT JOIN place 
        ON horaire.place_id = place.id 
      ORDER BY horaire.id DESC`;

    const data = await this.dbUtil.placeServiceQuery(query);

    if (data.rows.length === 0) {
      throw new NotFoundException('No horaires found');
    }

    const formattedData = data.rows.map((row) => ({
      id: row.id,
      jour: row.jour,
      jourNumber: row.jourNumber,
      debutPause: row.debutPause,
      finPause: row.finPause,
      fin: row.fin,
      debut: row.debut,
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

  async create(horaire: CreateHoraireDto): Promise<any> {
    const query = `
      INSERT INTO horaire 
        (jour, jourNumber, debutPause, finPause, debut, fin, place_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    const params = [
      horaire.jour,
      horaire.jourNumber,
      horaire.debutPause,
      horaire.finPause,
      horaire.debut,
      horaire.fin,
      horaire.place_id,
    ];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (data.rows.length === 0) {
      throw new Error('Failed to create horaire');
    }

    return data.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `
      SELECT 
        horaire.*, 
     
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
      FROM horaire 
      LEFT JOIN place 
        ON horaire.place_id = place.id 
      WHERE horaire.id = $1`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (data.rows.length === 0) {
      throw new NotFoundException(`Horaire with ID ${id} not found`);
    }

    const row = data.rows[0];
    return {
      id: row.id,
      jour: row.jour,
      jourNumber: row.jourNumber,
      debutPause: row.debutPause,
      finPause: row.finPause,
      fin: row.fin,
      debut: row.debut,
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

  async update(id: number, horaire: any): Promise<any> {
    const query = `
      UPDATE horaire 
      SET jour = $1, jourNumber = $2, debutPause = $3, finPause = $4, debut = $5, fin = $6, place_id = $7 
      WHERE id = $8 
      RETURNING *`;
    const params = [
      horaire.jour,
      horaire.jourNumber,
      horaire.debutPause,
      horaire.finPause,
      horaire.debut,
      horaire.fin,
      horaire.place_id,
      id,
    ];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (data.rows.length === 0) {
      throw new NotFoundException(`Failed to update horaire with ID ${id}`);
    }

    return data.rows[0];
  }

  async delete(id: number): Promise<any> {
    const query = `DELETE FROM horaire WHERE id = $1 RETURNING *`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    if (data.rows.length === 0) {
      throw new NotFoundException(`Horaire with ID ${id} not found`);
    }

    return data.rows[0];
  }
}
