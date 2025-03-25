import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { Externe } from '../entities/externe.entity';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class ExterneService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer tous les comptes
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 25 } = paginationDto; // Valeurs par défaut

    const query = `SELECT * FROM transaction_operation where transaction_service_type = 'externe' ORDER BY id DESC `;
    const data = await this.dbUtil.loyaltyServiceQuery(query);
    return paginate(data.rows, page, limit);
  }
  // Création d'un compte
  
}
