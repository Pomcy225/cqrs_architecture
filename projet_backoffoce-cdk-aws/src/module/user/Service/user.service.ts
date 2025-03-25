import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class UserService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer tous les comptes avec pagination
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const query = `SELECT * FROM users ORDER BY id DESC`;
      const users = await this.dbUtil.endUserServiceQuery(query);
     const formattedData= users.rows;
      // Vérifier si la pagination est valide
      if (page && limit && page > 0 && limit > 0) {
        return paginate(formattedData, page, limit);
      }

      return formattedData;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la récupération des utilisateurs : ${error.message}`,
      );
    }
  }
}