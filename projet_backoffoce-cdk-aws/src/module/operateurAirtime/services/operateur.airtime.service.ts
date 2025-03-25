import { Injectable } from '@nestjs/common';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { OperateurAirtime } from '../entities/operateur.airtime.entity';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { CreateOperateurAirtimeDto } from '../dto/create-operateur.airtime.dto';

@Injectable()
export class OperateurAirtimeService {
  private readonly tableName = 'OperateurAirtime';
  private readonly client: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    const ddbClient = new DynamoDBClient({
      region: this.configService.get<string>('REGION'),
    });
    this.client = DynamoDBDocumentClient.from(ddbClient);
  }




  // ✅ Lister tous les opérateurs avec pagination
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const command = new ScanCommand({ TableName: this.tableName });
    const response = await this.client.send(command);
    return paginate(response.Items || [], page, limit);
  }



  // ✅ Activer/Désactiver un opérateur

  async toggleStatus(id: string) {
    // Récupérer l'opérateur
    const getCommand = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const result = await this.client.send(getCommand);
    const res = result.Item;

    // Vérifier si l'opérateur existe
    if (!res || !res.status) {
      throw new Error('Opérateur introuvable ou statut manquant');
    }

    // Basculer le statut
    const newStatus = res.status === 'active' ? 'inactive' : 'active';

    // Mise à jour du statut
    const updateCommand = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET #s = :status',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':status': newStatus },
      ReturnValues: 'UPDATED_NEW',
    });

    const response = await this.client.send(updateCommand);
    return response.Attributes;
  }
}
