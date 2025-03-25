import { Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { Commentaire } from '../entities/commentaire.entity';
import { CreateCommentaireDto } from '../dto/create-commentaire';

@Injectable()
export class CommentaireService {
  constructor(private readonly dbUtil: DBUtil) {}

  /**
   * Retrieve all commentaires with pagination.
   * @param paginationDto Pagination details.
   * @returns Paginated list of commentaires.
   */
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `
      SELECT 
        commentaire.*, 

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
      FROM commentaire 
      LEFT JOIN place 
        ON commentaire.place_id = place.id  
      ORDER BY commentaire.id DESC`;

    const data = await this.dbUtil.placeServiceQuery(query);
    const formattedData = data.rows.map((row) =>
      this.formatCommentaireWithPlace(row),
    );

    return paginate(formattedData, page, limit);
  }

  /**
   * Create a new commentaire.
   * @param commentaire Data for the new commentaire.
   * @returns The created commentaire.
   */
  async create(commentaire: CreateCommentaireDto): Promise<Commentaire> {
    const createdat = new Date();
    const query = `
      INSERT INTO commentaire (user_id, comment, statut, createdat, rating, place_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;

    const params = [
      commentaire.user_id,
      commentaire.comment,
      commentaire.statut,
      createdat,
      commentaire.rating,
      commentaire.place_id,
    ];

    const data = await this.dbUtil.placeServiceQuery(query, params);
    if (data.rows.length === 0) {
      throw new NotFoundException('Failed to create commentaire');
    }
    return data.rows[0];
  }

  /**
   * Retrieve a single commentaire by ID.
   * @param id The ID of the commentaire.
   * @returns The commentaire with place details.
   */
  async getOne(id: number): Promise<Commentaire> {
    const query = `
    SELECT 
      commentaire.*, 
      
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
    FROM commentaire 
    LEFT JOIN place 
      ON commentaire.place_id = place.id 
    WHERE commentaire.id = $1`;

    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);

    // Vérifier si des données sont retournées
    if (data.rows.length === 0) {
      throw new NotFoundException(`Commentaire with ID ${id} not found`);
    }

    const formattedData = data.rows.map((row) =>
      this.formatCommentaireWithPlace(row),
    );
    // Retourner le commentaire formaté
    return formattedData;
  }

  /**
   * Update an existing commentaire by ID.
   * @param id The ID of the commentaire.
   * @param commentaire Data to update the commentaire.
   * @returns The updated commentaire.
   */
  async update(
    id: number,
    commentaire: Partial<CreateCommentaireDto>,
  ): Promise<Commentaire> {
    const query = `
      UPDATE commentaire 
      SET 
        user_id = $1, 
        comment = $2, 
        statut = $3, 
        rating = $4, 
        place_id = $5 
      WHERE id = $6 
      RETURNING *`;

    const params = [
      commentaire.user_id,
      commentaire.comment,
      commentaire.statut,
      commentaire.rating,
      commentaire.place_id,
      id,
    ];

    const data = await this.dbUtil.placeServiceQuery(query, params);
    if (data.rows.length === 0) {
      throw new NotFoundException(
        `Commentaire with ID ${id} not found for update`,
      );
    }
    return data.rows[0];
  }

  /**
   * Delete a commentaire by ID.
   * @param id The ID of the commentaire.
   * @returns The deleted commentaire.
   */
  async delete(id: number): Promise<Commentaire> {
    const query = `DELETE FROM commentaire WHERE id = $1 RETURNING *`;
    const params = [id];

    const data = await this.dbUtil.placeServiceQuery(query, params);
    if (data.rows.length === 0) {
      throw new NotFoundException(
        `Commentaire with ID ${id} not found for deletion`,
      );
    }
    return data.rows[0];
  }

  /**
   * Helper method to format commentaire data with associated place details.
   * @param row A row from the database query.
   * @returns A formatted commentaire object.
   */
  private formatCommentaireWithPlace(row: any) {
    return {
      id: row.id,
      user_id: row.user_id,
      commentaire: row.comment,
      statut: row.statut,
      rating: row.rating,
      createdat: row.createdat,
      updatedat: row.updatedat,
      place_id: row.place_id,
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
  // Inverser le statut d'un commentaire
 async toggleStatus(id: number): Promise<any> {
  const findQuery = `SELECT * FROM commentaire WHERE id = $1`;
  const updateQuery = `
    UPDATE commentaire 
    SET statut = $2 
    WHERE id = $1 
    RETURNING *
  `;

  const params1 = [id];

  try {
    // Récupérer le statut actuel
    const findResult = await this.dbUtil.placeServiceQuery(findQuery, params1);

    if (!findResult.rows.length) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const currentStatus: boolean = findResult.rows[0].statut;
    const newStatus = !currentStatus; // Inverse le statut actuel

    const params2 = [id, newStatus];

    // Mettre à jour le statut
    const updateResult = await this.dbUtil.placeServiceQuery(
      updateQuery,
      params2,
    );

    return updateResult.rows[0];
  } catch (error) {
    console.error(`Error toggling comment status for ID ${id}:`, error);

    throw new InternalServerErrorException(
      'Erreur lors de la mise à jour du statut du commentaire.',
    );
  }
}
}
