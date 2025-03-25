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
var SqsConsumerSoldeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqsConsumerSoldeService = void 0;
const common_1 = require("@nestjs/common");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const config_1 = require("@nestjs/config");
const mercure_service_1 = require("../mercure/mercure.service");
const db_utils_1 = require("../utils/db-utils");
let SqsConsumerSoldeService = SqsConsumerSoldeService_1 = class SqsConsumerSoldeService {
    constructor(mercureService, dbUtils, configService) {
        this.mercureService = mercureService;
        this.dbUtils = dbUtils;
        this.configService = configService;
        this.logger = new common_1.Logger(SqsConsumerSoldeService_1.name);
        this.queueUrl = this.configService.get('QUEUE_URL_MERCURE_SOLDE');
        this.activeMessagesCount = 0;
        this.sqsClient = new client_sqs_1.SQSClient({
            region: this.configService.get('AWS_REGION'),
        });
        this.isRunning = true;
        this.stopRequested = false;
    }
    async onModuleInit() {
        this.logger.log('Démarrage du service solde de consommation SQS...');
        this.isRunning = true;
        this.stopRequested = false;
        this.pollMessages();
    }
    async onModuleDestroy() {
        this.logger.log('Arrêt du service solde demandé...');
        this.stopRequested = true;
        await this.waitForActiveMessagesToComplete();
        this.logger.log('Tous les messages ont été consommés du service solde.');
    }
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
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 1,
                };
                const data = await this.sqsClient.send(new client_sqs_1.ReceiveMessageCommand(receiveParams));
                if (data.Messages && data.Messages.length > 0) {
                    this.activeMessagesCount += data.Messages.length;
                    await Promise.all(data.Messages.map(async (message) => {
                        try {
                            this.logger.log('Message reçu:', message.Body);
                            const parsedMessages = JSON.parse(message.Body);
                            await this.processMessage(parsedMessages);
                            const deleteParams = await this.deleteMessage(message.ReceiptHandle);
                            this.logger.log('Message consomme:', deleteParams);
                        }
                        catch (error) {
                            this.logger.error('Erreur lors du traitement du message:', error);
                        }
                        finally {
                            this.activeMessagesCount--;
                        }
                    }));
                }
                else {
                }
            }
            catch (error) {
                this.logger.error('Erreur lors de la récupération des messages SQS:', error);
            }
        }
    }
    async processMessage(msg) {
        const { topicName, user_id } = msg;
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
        const url = `/user/` + msg.topicName;
        await this.mercureService.publishNotification(url, wallet);
    }
    async deleteMessage(receiptHandle) {
        const deleteParams = {
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle,
        };
        try {
            await this.sqsClient.send(new client_sqs_1.DeleteMessageCommand(deleteParams));
            this.logger.log('Message supprimé avec succès.');
        }
        catch (error) {
            this.logger.error('Erreur lors de la suppression du message:', error);
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
exports.SqsConsumerSoldeService = SqsConsumerSoldeService;
exports.SqsConsumerSoldeService = SqsConsumerSoldeService = SqsConsumerSoldeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mercure_service_1.MercureService,
        db_utils_1.DBUtil,
        config_1.ConfigService])
], SqsConsumerSoldeService);
//# sourceMappingURL=sqs_consumer_solde_service.js.map