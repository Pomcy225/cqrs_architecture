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

@Injectable()
export class SqsConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerService.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private isRunning = false;
  private activeMessagesCount = 0;
  private stopRequested = false;

  constructor(
    private readonly mercureService: MercureService,
    private readonly configService: ConfigService,
  ) {
    this.sqsClient = new SQSClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.queueUrl = this.configService.get<string>('QUEUE_URL_MERCURE');
  }

  async onModuleInit() {
    this.logger.log('Démarrage du service de consommation SQS...');
    this.isRunning = true;
    this.stopRequested = false;
    this.pollMessages();
  }

  async onModuleDestroy() {
    this.logger.log('Arrêt du service demandé...');
    this.stopRequested = true;
    await this.waitForActiveMessagesToComplete();
    this.logger.log('Tous les messages ont été consommés. Service arrêté.');
  }

  private async pollMessages() {
    while (this.isRunning) {
      if (this.stopRequested && this.activeMessagesCount === 0) {
        this.logger.log('Aucun message actif, arrêt du service SQS...');
        this.isRunning = false;
        break;
      }

      try {
        const data = await this.sqsClient.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 1,
          }),
        );

        if (data.Messages && data.Messages.length > 0) {
          this.activeMessagesCount += data.Messages.length;
          await Promise.all(
            data.Messages.map(async (message) => {
              try {
                this.logger.log(`Message reçu: ${message.Body}`);
                const parsedMessage = JSON.parse(message.Body);

                if (!parsedMessage || typeof parsedMessage !== 'object') {
                  throw new Error('Message invalide reçu.');
                }

                await this.processMessage(parsedMessage);
                await this.deleteMessage(message.ReceiptHandle);
              } catch (error) {
                this.logger.error(
                  `Erreur lors du traitement du message: ${error.message}`,
                );
              } finally {
                this.activeMessagesCount--;
              }
            }),
          );
        } else {
          this.logger.debug('Aucun message disponible.');
        }
      } catch (error) {
        this.logger.error(
          `Erreur lors de la récupération des messages SQS: ${error.message}`,
        );
      }
    }
  }

  private async processMessage(msg ) {
  //  const { topic, data } = msg;

  const { topicName, ...filteredData } = msg;


    if (!topicName) {
      this.logger.warn('Message reçu sans topic valide:', msg);
      return;
    }

    this.logger.log(`Traitement du message - Topic: ${topicName}`);
    try {
      const result = await this.mercureService.publishNotification(
        topicName,
        filteredData,
      );
      this.logger.log('Résultat de la publication de la notification:', result);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la publication de la notification: ${error.message}`,
      );
    }
  }

  private async deleteMessage(receiptHandle: string) {
    try {
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: receiptHandle,
        }),
      );
      this.logger.log('Message supprimé avec succès.');
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression du message: ${error.message}`,
      );
    }
  }

  private waitForActiveMessagesToComplete(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.activeMessagesCount === 0) {
          clearInterval(interval);
          resolve();
        }
      }, 600);
    });
  }
}
