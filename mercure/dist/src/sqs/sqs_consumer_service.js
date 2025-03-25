"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SqsConsumerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqsConsumerService = void 0;
const common_1 = require("@nestjs/common");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const config_1 = require("@nestjs/config");
const mercure_service_1 = require("../mercure/mercure.service");
let SqsConsumerService = SqsConsumerService_1 = class SqsConsumerService {
    constructor(mercureService, configService) {
        this.mercureService = mercureService;
        this.configService = configService;
        this.logger = new common_1.Logger(SqsConsumerService_1.name);
        this.isRunning = false;
        this.activeMessagesCount = 0;
        this.stopRequested = false;
        this.sqsClient = new client_sqs_1.SQSClient({
            region: this.configService.get('AWS_REGION'),
        });
        this.queueUrl = this.configService.get('QUEUE_URL_MERCURE');
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
    async pollMessages() {
        while (this.isRunning) {
            if (this.stopRequested && this.activeMessagesCount === 0) {
                this.logger.log('Aucun message actif, arrêt du service SQS...');
                this.isRunning = false;
                break;
            }
            try {
                const data = await this.sqsClient.send(new client_sqs_1.ReceiveMessageCommand({
                    QueueUrl: this.queueUrl,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 1,
                }));
                if (data.Messages && data.Messages.length > 0) {
                    this.activeMessagesCount += data.Messages.length;
                    await Promise.all(data.Messages.map(async (message) => {
                        try {
                            this.logger.log(`Message reçu: ${message.Body}`);
                            const parsedMessage = JSON.parse(message.Body);
                            if (!parsedMessage || typeof parsedMessage !== 'object') {
                                throw new Error('Message invalide reçu.');
                            }
                            await this.processMessage(parsedMessage);
                            await this.deleteMessage(message.ReceiptHandle);
                        }
                        catch (error) {
                            this.logger.error(`Erreur lors du traitement du message: ${error.message}`);
                        }
                        finally {
                            this.activeMessagesCount--;
                        }
                    }));
                }
                else {
                    this.logger.debug('Aucun message disponible.');
                }
            }
            catch (error) {
                this.logger.error(`Erreur lors de la récupération des messages SQS: ${error.message}`);
            }
        }
    }
    async processMessage(msg) {
        const { topicName, ...filteredData } = msg;
        if (!topicName) {
            this.logger.warn('Message reçu sans topic valide:', msg);
            return;
        }
        this.logger.log(`Traitement du message - Topic: ${topicName}`);
        try {
            const result = await this.mercureService.publishNotification(topicName, filteredData);
            this.logger.log('Résultat de la publication de la notification:', result);
        }
        catch (error) {
            this.logger.error(`Erreur lors de la publication de la notification: ${error.message}`);
        }
    }
    async deleteMessage(receiptHandle) {
        try {
            await this.sqsClient.send(new client_sqs_1.DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: receiptHandle,
            }));
            this.logger.log('Message supprimé avec succès.');
        }
        catch (error) {
            this.logger.error(`Erreur lors de la suppression du message: ${error.message}`);
        }
    }
    waitForActiveMessagesToComplete() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.activeMessagesCount === 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 600);
        });
    }
};
exports.SqsConsumerService = SqsConsumerService;
exports.SqsConsumerService = SqsConsumerService = SqsConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mercure_service_1.MercureService,
        config_1.ConfigService])
], SqsConsumerService);
//# sourceMappingURL=sqs_consumer_service.js.map