import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateGrilleTarifaireDto, UpdateGrilleTarifaireDto } from '../dto/create-grille-tarifaire.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class GrilleTarifaireService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer toutes les grilles tarifaires avec pagination
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `SELECT * FROM grille_tarifaire ORDER BY id DESC`;
    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query);
      return paginate(data.rows, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des grilles tarifaires.',
      );
    }
  }

  // Créer une nouvelle grille tarifaire
  async create(createDto: CreateGrilleTarifaireDto) {
    const query = `
      INSERT INTO grille_tarifaire 
      (montant, date_debut, date_fin, point) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const params = [
      createDto.montant,
      createDto.date_debut,
      createDto.date_fin,
      createDto.point,
    ];

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, params);
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création de la grille tarifaire.',
      );
    }
  }

  // Récupérer une grille tarifaire par ID
  async getOne(id: number) {
    const query = `SELECT * FROM grille_tarifaire WHERE id = $1`;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rows.length === 0) {
        throw new NotFoundException(
          `Grille tarifaire avec ID ${id} non trouvée.`,
        );
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la grille tarifaire.',
      );
    }
  }

  // Mettre à jour une grille tarifaire
  async update(id: number, updateDto: UpdateGrilleTarifaireDto) {
    const fields = Object.keys(updateDto)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE grille_tarifaire 
      SET ${fields} 
      WHERE id = $1 
      RETURNING *
    `;
    const params = [id, ...Object.values(updateDto)];

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, params);
      if (data.rows.length === 0) {
        throw new NotFoundException(
          `Grille tarifaire avec ID ${id} non trouvée.`,
        );
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour de la grille tarifaire.',
      );
    }
  }

  // Supprimer une grille tarifaire
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM grille_tarifaire WHERE id = $1`;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rowCount === 0) {
        throw new NotFoundException(
          `Grille tarifaire avec ID ${id} non trouvée.`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la suppression de la grille tarifaire.',
      );
    }
  }
}
