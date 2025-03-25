import { Injectable, Logger } from '@nestjs/common';
import { Tickete } from './entities/ticket.entity';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';
import { ConnectionStatus } from '@aws-sdk/client-ssm';
import { query } from 'express';
import { DBUtil } from 'src/utils/db-utils';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);
  static findUserIdWithIndex(user_id: string) {
    throw new Error('Method not implemented.');
  }
  static notification() {
    throw new Error('Method not implemented.');
  }

  // variables for dynamodb

  private readonly tableName = 'Ticket';
  private readonly client: DynamoDBClient;
  /**
   * Service constructor
   *
   * Initializes dynamodb client
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly dbUtil: DBUtil,
  ) {
    this.client = new DynamoDBClient({
      region: this.configService.get('AWS_REGION'),
    });
  }

  async create(data: any) {
    if (data) {
      data = Tickete.newInstanceFromDTO(data);
    }
    const itemObject: Record<string, AttributeValue> = {
      id: {
        S: data.id,
      },

      created_at: {
        S: data.created_at,
      },
    };
    if (data.type_reclamation) {
      itemObject.type_reclamation = {
        S: data.type_reclamation,
      };
    }
    if (data.numero) {
      itemObject.numero = {
        S: data.numero,
      };
    }
    if (data.nom) {
      itemObject.nom = {
        S: data.nom,
      };
    }
    if (data.prenom) {
      itemObject.prenom = {
        S: data.prenom,
      };
    }
    if (data.priorite) {
      itemObject.priorite = {
        S: data.priorite,
      };
    }
    if (data.transaction_id) {
      itemObject.transaction_id = {
        S: data.transaction_id,
      };
    }
    if(data.libelle) {
      itemObject.libelle = {
        S: data.libelle,
      };
    }

    if (data.description) {
      itemObject.description = {
        S: data.description,
      };
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: itemObject,
    });

    const datas = await this.client.send(command);
    if (datas) {
      return data;
    }
    return null;
  }

  async findAll() {
    const res: Tickete[] = [];

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.client.send(command);

    if (response.Items) {
      for (const item of response.Items) {
        res.push(Tickete.newInstanceFormDynamoDBObject(item));
      }
    }

    // Exécution des requêtes SQL en parallèle pour optimiser la performance
    const results = await Promise.all(
      res.map(async (item) => {
        if (!item.transaction_id) {
          return {
            id: item.id,
            libelle: item.libelle ?? '',
            created_at: item.created_at ?? null,
            transaction_id: item.transaction_id ?? null,
            ref_transaction: '',
            description: item.description ?? '',
            priorite: item.priorite ?? '',
            type_reclamation: item.type_reclamation ?? '',
            numero: item.numero ?? '',
            nom: item.nom ?? '',
            prenom: item.prenom ?? '',
          };
        }
        const params = [item.transaction_id];
        const query = `SELECT * FROM transaction_operation WHERE id = $1 ORDER BY id DESC`;

        const queryResult = await this.dbUtil.walletServiceQuery(query, params);
        const param1 = [queryResult.rows[0].user_owner_id];
        const queryUser = `SELECT * FROM users WHERE id = $1`;
        const resUser = await this.dbUtil.walletServiceQuery(queryUser, param1);
        const refTransaction =
          queryResult.rows.length > 0 ? queryResult.rows[0].ref : null;

        return {
          id: item.id,
          libelle: item.libelle ?? '',
          created_at: item.created_at ?? null,
          transaction_id: item.transaction_id ?? null,
          ref_transaction: refTransaction ?? '',
          description: item.description ?? '',
          priorite: item.priorite ?? '',
          type_reclamation: item.type_reclamation ?? '',
          numero: item.numero ?? '',
          nom: item.nom ?? '',
          prenom: item.prenom ?? '',
          user: {
            id: resUser.rows[0].public_id,
            numero: resUser.rows[0].full_login,
            nom: resUser.rows[0].first_name,
            prenom: resUser.rows[0].last_name,
          },
        };
      }),
    );

    return results;
  }

  async update(id: string, updateTicketeDto: UpdateTicketDto) {
    const updateExpressionParts: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    // verify if mail exists
    if (updateTicketeDto.description) {
      updateExpressionParts.push('#description = :description');
      expressionAttributeValues[':description'] = {
        S: updateTicketeDto.description,
      };
      expressionAttributeNames['#description'] = 'description';
    }
    // verify if user_id exists
    if (updateTicketeDto.libelle) {
      updateExpressionParts.push('#libelle = :libelle');
      expressionAttributeValues[':libelle'] = {
        S: updateTicketeDto.libelle,
      };
      expressionAttributeNames['#libelle'] = 'libelle';
    }
    if (updateTicketeDto.transaction_id) {
      updateExpressionParts.push('#transaction_id = :transaction_id');
      expressionAttributeValues[':transaction_id'] = {
        S: updateTicketeDto.transaction_id,
      };
      expressionAttributeNames['#transaction_id'] = 'transaction_id';
    }
    if (updateTicketeDto.priorite) {
      updateExpressionParts.push('#priorite = :priorite');
      expressionAttributeValues[':priorite'] = {
        S: updateTicketeDto.priorite,
      };
      expressionAttributeNames['#priorite'] = 'priorite';
    }
    if (updateTicketeDto.type_reclamation) {
      updateExpressionParts.push('#type_reclamation = :type_reclamation');
      expressionAttributeValues[':type_reclamation'] = {
        S: updateTicketeDto.type_reclamation,
      };
      expressionAttributeNames['#type_reclamation'] = 'type_reclamation';
    }
    if (updateTicketeDto.numero) {
      updateExpressionParts.push('#numero = :numero');
      expressionAttributeValues[':numero'] = {
        S: updateTicketeDto.numero,
      };
      expressionAttributeNames['#numero'] = 'numero';
    }
    if (updateTicketeDto.nom) {
      updateExpressionParts.push('#nom = :nom');
      expressionAttributeValues[':nom'] = {
        S: updateTicketeDto.nom,
      };
      expressionAttributeNames['#nom'] = 'nom';
    }
    if (updateTicketeDto.prenom) {
      updateExpressionParts.push('#prenom = :prenom');
      expressionAttributeValues[':prenom'] = {
        S: updateTicketeDto.prenom,
      };
      expressionAttributeNames['#prenom'] = 'prenom';
    }

    // Combine all update expressions
    const updateExpression = 'SET ' + updateExpressionParts.join(', ');

    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames, // Pass the aliases here
      ReturnValues: 'ALL_NEW', // Optionally return updated item
    });

    await this.client.send(command);

    const commands = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        id: {
          S: id,
        },
      },
    });
    const response = await this.client.send(commands);
    const res = response.Item;

    if (response.Item) {
      return Tickete.newInstanceFormDynamoDBObject(response.Item);
    }

    return undefined;
  }

  async delete(id: string) {
    try {
      // Commande pour supprimer l'utilisateur par son ID
      const deleteCommand = new DeleteItemCommand({
        TableName: this.tableName,
        Key: {
          id: { S: id },
        },
      });

      // Exécution de la suppression
      await this.client.send(deleteCommand);
      this.logger.log(`Utilisateur avec id ${id} supprimé.`);

      return null;
    } catch (error) {
      this.logger.error('Erreur lors de la suppression de ticket.', error);
      throw new Error('Erreur lors de la suppression de ticket.');
    }
  }
}
