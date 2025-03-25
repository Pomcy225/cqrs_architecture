import { Injectable, NotFoundException } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateConversionDto } from '../dto/create-conversion.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class ConversionService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer toutes les conversions
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `SELECT * FROM conversion ORDER BY id DESC`;
    const data = await this.dbUtil.loyaltyServiceQuery(query);
    return paginate(data.rows, page, limit);
  }

  // Créer une conversion
  async create(createDto: CreateConversionDto) {
    const query = `
      INSERT INTO conversion 
      (point, montant) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const params = [
      createDto.point,
      createDto.montant,
    ];

    const data = await this.dbUtil.loyaltyServiceQuery(query, params);
    return data.rows[0];
  }

  // Récupérer une conversion par ID
  async getOne(id: number) {
    const query = `SELECT * FROM conversion WHERE id = $1`;

    const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
    if (data.rows.length === 0) {
      throw new NotFoundException(`Conversion avec ID ${id} non trouvée`);
    }
    return data.rows[0];
  }

  // Mettre à jour une conversion
  async update(id: number, updateDto) {
    const fields = Object.keys(updateDto)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE conversion 
      SET ${fields} 
      WHERE id = $1 
      RETURNING *
    `;
    const params = [id, ...Object.values(updateDto)];

    const data = await this.dbUtil.loyaltyServiceQuery(query, params);
    if (data.rows.length === 0) {
      throw new NotFoundException(`Conversion avec ID ${id} non trouvée`);
    }
    return data.rows[0];
  }

  // Supprimer une conversion
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM conversion WHERE id = $1`;

    const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
    if (data.rowCount === 0) {
      throw new NotFoundException(`Conversion avec ID ${id} non trouvée`);
    }
  }
}
