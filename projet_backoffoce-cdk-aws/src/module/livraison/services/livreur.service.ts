import { Injectable } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { CreateLivreurDto } from '../dto/create-livreur.dto';

@Injectable()
export class LivreurService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto; // Valeurs par défaut

    // Requête pour récupérer les données
    const query = `SELECT * FROM livreur ORDER BY id DESC`;
    const data = await this.dbUtil.endUserServiceQuery(query);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      nom: row.nom,
      prenoms: row.prenoms,
      telephone: row.telephone,
    }));

    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
    return formattedData;
    // Appliquer la pagination
  }
  async findAllWithoutPagination() {
    
    // Requête pour récupérer les données
    const query = `SELECT * FROM livreur ORDER BY id DESC`;
    const data = await this.dbUtil.endUserServiceQuery(query);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      nom: row.nom,
      prenoms: row.prenoms,
      telephone: row.telephone,
    }));

   
    return formattedData;
    // Appliquer la pagination
  }

  async create(livreur: CreateLivreurDto): Promise<any> {
    const query = `INSERT INTO livreur (nom,prenoms,telephone, compte,createdAt,updatedAt) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *`;
    const now = new Date();
    const params = [
      livreur.nom,
      livreur.prenoms,
      livreur.telephone,
      livreur.compte,
      now,
      now,
    ];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM livreur WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }
  async getOneByCompte(id: string): Promise<any> {
    const query = `SELECT * FROM livreur WHERE compte = $1`;
    const params = [id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }

  async update(id: number, livreur: any): Promise<any> {
    const query = `UPDATE livreur 
                   SET nom = $1, prenoms = $2, telephone = $3, compte = $4, updatedAt = $5 
                   WHERE id = $6 
                   RETURNING *`;
    const now = new Date();
    const params = [
      livreur.nom,
      livreur.prenoms,
      livreur.telephone,
      livreur.compte,
      now,
      id,
    ];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }

  async delete(id: number): Promise<any> {
    const query = `DELETE FROM livreur WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }
}
