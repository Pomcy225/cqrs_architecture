import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { MercureService } from 'src/mercure/mercure.service';
import { DBUtil } from 'src/utils/db-utils';

@Injectable()
export class SqsConsumerSoldeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerSoldeService.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string = this.configService.get(
    'QUEUE_URL_MERCURE_SOLDE',
  );

  private isRunning: boolean;
  private activeMessagesCount: number = 0;
  private stopRequested: boolean;

  constructor(
    private readonly mercureService: MercureService,
    private readonly dbUtils: DBUtil,
    private readonly configService: ConfigService,
  ) {
    this.sqsClient = new SQSClient({
      region: this.configService.get('AWS_REGION'),
    });
    this.isRunning = true;
    this.stopRequested = false;
  }

  /**
   * Méthode appelée au démarrage du module
   */
  async onModuleInit() {
    this.logger.log('Démarrage du service solde de consommation SQS...');
    this.isRunning = true;
    this.stopRequested = false;
    this.pollMessages();
  }

  /**
   * Méthode appelée à la destruction du module
   */
  async onModuleDestroy() {
    this.logger.log('Arrêt du service solde demandé...');
    this.stopRequested = true;
    await this.waitForActiveMessagesToComplete();
    this.logger.log('Tous les messages ont été consommés du service solde.');
  }

  /**
   * Boucle principale pour poller les messages de la file d'attente SQS
   */
  async pollMessages() {
    while (this.isRunning) {
      if (this.stopRequested && this.activeMessagesCount === 0) {
        this.logger.log('Aucun message actif, arrêt du service solde SQS...');
        this.isRunning = false;
        break;
      }

      try {
        const receiveParams = {
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10, // Ajustez pour optimiser le nombre de messages traités
          WaitTimeSeconds: 1, // Long polling pour économiser les ressources
        };

        const data = await this.sqsClient.send(
          new ReceiveMessageCommand(receiveParams),
        );

        if (data.Messages && data.Messages.length > 0) {
          this.activeMessagesCount += data.Messages.length;
          await Promise.all(
            data.Messages.map(async (message) => {
              try {
                this.logger.log('Message reçu:', message.Body);
                const parsedMessages = JSON.parse(message.Body);

                // Validation pour s'assurer qu'on traite un tableau de messages

                await this.processMessage(parsedMessages);

                const deleteParams = await this.deleteMessage(
                  message.ReceiptHandle,
                );

                this.logger.log('Message consomme:', deleteParams);
              } catch (error) {
                this.logger.error(
                  'Erreur lors du traitement du message:',
                  error,
                );
              } finally {
                this.activeMessagesCount--;
              }
            }),
          );
        } else {
          // commenting it as it will fill the container logs
          // this.logger.log('Aucun message disponible.');
        }
      } catch (error) {
        this.logger.error(
          'Erreur lors de la récupération des messages SQS:',
          error,
        );
      }
    }
  }

  /**
   * Traite un message unique.
   * @param msg Le message à traiter
   * @see EnvoiService.envoi
   * @private
   */
  private async processMessage(msg) {
    const { topicName, user_id } = msg;

    // Validation des champs obligatoires
    if (!topicName) {
      this.logger.warn('Message reçu avec des données invalides', msg);

      return {
        status: false,
        message: "'Message reçu avec des données invalides",
      };
    }

    const user = msg.user_id;

    const query = `SELECT * FROM wallet WHERE user_id = $1`;
    const params = [user];
    const result = await this.dbUtils.walletServiceQuery(query, params);

    if (result.rows.length === 0) {
      this.logger.warn(`Wallet non trouvé pour l'utilisateur`, user_id);
      return {
        status: false,
        message: 'user not found in wallet',
      };
    }

    const wallet = result.rows;
    const url = msg.topicName;

    await this.mercureService.publishNotification(url, wallet);
  }

  /**
   * Supprime un message de la file d'attente SQS.
   *
   * @param receiptHandle - Le handle de réception du message SQS.
   */
  async deleteMessage(receiptHandle: string) {
    const deleteParams = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };

    try {
      await this.sqsClient.send(new DeleteMessageCommand(deleteParams));
      this.logger.log('Message supprimé avec succès.');
    } catch (error) {
      this.logger.error('Erreur lors de la suppression du message:', error);
    }
  }

  /**
   * Attend jusqu'à ce qu'il n'y ait plus de messages actifs en traitement.
   * Utilisé pour s'assurer que tous les messages ont été traités avant d'arrêter le service.
   * @returns une promesse qui se résout lorsque tous les messages actifs sont terminés
   * @private
   */
  private waitForActiveMessagesToComplete(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.activeMessagesCount === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 600); // Vérifie toutes les 600 ms
    });
  }
}