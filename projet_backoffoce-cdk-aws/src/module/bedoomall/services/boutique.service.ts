import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoutiqueDto } from '../dto/create-boutique.dto';
import { Boutique, updateBoutique } from '../entities/boutique.entity';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class BoutiqueService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer toutes les boutiques
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto; // Valeurs par défaut

    // Simulation de données

    const query = `SELECT * FROM boutique ORDER BY id DESC`;
    const data = await this.dbUtil.bedooMallServiceQuery(query);

    /* const data = [];
      for (let i = 1; i <= 50; i++) {
        data.push({
          key: `value${i}`,
          description: `Description for value${i}`,
        });
      }
      
      */

    return paginate(data.rows, page, limit);
  }
  async create(createBoutiqueDto: CreateBoutiqueDto): Promise<updateBoutique> {
    const createdAt = new Date();
    const statut = 'false';

    const querys = `SELECT * FROM users WHERE full_login = $1`;
    const user = await this.dbUtil.endUserServiceQuery(querys, [
      createBoutiqueDto.user_tel,
    ]);

    const user_id = user.rows[0].public_id;
    const query = `
      INSERT INTO boutique 
      (libelle, nbre_vente, latitude, longitude, createdAt, statut, tel, email, logo,user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) 
      RETURNING *
    `;
    const params = [
      createBoutiqueDto.libelle,
      createBoutiqueDto.nbre_vente,
      createBoutiqueDto.latitude || null,
      createBoutiqueDto.longitude || null,
      createdAt,
      statut,
      createBoutiqueDto.tel,
      createBoutiqueDto.email,
      createBoutiqueDto.logo,
      user_id,
    ];

    const result = await this.dbUtil.bedooMallServiceQuery(query, params);
    return result.rows[0];
  }

  // Récupérer une boutique par ID
  async getOne(id: number): Promise<updateBoutique> {
    const query = `SELECT * FROM boutique WHERE id = $1`;

    const result = await this.dbUtil.bedooMallServiceQuery(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Boutique with ID ${id} not found`);
    }
    return result.rows[0];
  }

  // Mise à jour d'une boutique
  async update(
    id: number,
    updateData: Partial<updateBoutique>,
  ): Promise<updateBoutique> {
    const fields = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE boutique 
      SET ${fields} 
      WHERE id = $1 
      RETURNING *
    `;

    const params = [id, ...Object.values(updateData)];

    const result = await this.dbUtil.bedooMallServiceQuery(query, params);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Boutique with ID ${id} not found`);
    }
    return result.rows[0];
  }

  // Suppression d'une boutique
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM boutique WHERE id = $1`;

    const result = await this.dbUtil.bedooMallServiceQuery(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Boutique with ID ${id} not found`);
    }
  }

  // Inverse le statut d'une boutique
  async toggleStatus(id: number): Promise<updateBoutique> {
    const findQuery = `SELECT statut FROM boutique WHERE id = $1`;
    const updateQuery = `
    UPDATE boutique 
    SET statut = $2 
    WHERE id = $1 
    RETURNING *
  `;

    // Récupérer le statut actuel de la boutique
    const findResult = await this.dbUtil.bedooMallServiceQuery(findQuery, [id]);
    if (findResult.rows.length === 0) {
      throw new NotFoundException(`Boutique with ID ${id} not found`);
    }

    const currentStatus = findResult.rows[0].statut === 'true';
    const newStatus = !currentStatus;

    // Mettre à jour le statut
    const updateResult = await this.dbUtil.bedooMallServiceQuery(updateQuery, [
      id,
      newStatus.toString(),
    ]);
    return updateResult.rows[0];
  }
}
