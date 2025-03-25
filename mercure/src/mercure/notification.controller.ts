import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { MercureService } from './mercure.service';

@ApiTags('notifications') // Ajoute une catégorie "notifications" dans Swagger
@Controller('notifications')
export class NotificationController {
  constructor(private readonly mercureService: MercureService) {}

  @ApiOperation({ summary: 'Publie une notification via Mercure' }) // Résumé de l'endpoint
  @ApiBody({
    description: 'Données de la notification',
    schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          example: 'user/123',
          description: 'Sujet du flux Mercure',
        },
        data: {
          type: 'object',
          example: { topicName: 'value', key1: 'value', key2: 'value' },
          description: 'Données à envoyer',
        },
      },
    },
  })
  @Post('publish')
  async sendNotification(@Body() body: { topic: string; data: any }) {
    const result = await this.mercureService.publishNotification(body.topic, {
      message: body.data,
    });

    return { status: 'Notification sent' };
  }

  @ApiOperation({
    summary: 'recuperer une notification via SQS et envoir vers mercure',
  })
  @ApiBody({
    description: 'Données de la notification',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          example: { topicName: 'value', key1: 'value', key2: 'value' },
          description: 'Données à envoyer',
        },
      },
    },
  })
  @Post('sqsSonsumer')
  async sqsconsumer(@Body() body: { data: any }) {
    return { status: 'Notification sent' };
  }

  @ApiOperation({
    summary: 'recuperer le sole via SQS et envoir vers mercure',
  })
  @ApiBody({
    description: 'Données pour le solde',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          example: { topicName: 'user/123', user_id: 'user_id' },
          description: 'Données à envoyer',
        },
      },
    },
  })
  @Post('sqsconsumer_solde')
  async sqsConsumerSolde(@Body() body: { data: any }) {
    return { status: 'solde sent' };
  }
}
