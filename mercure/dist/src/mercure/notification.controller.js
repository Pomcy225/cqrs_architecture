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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mercure_service_1 = require("./mercure.service");
let NotificationController = class NotificationController {
    constructor(mercureService) {
        this.mercureService = mercureService;
    }
    async sendNotification(body) {
        const result = await this.mercureService.publishNotification(body.topic, {
            message: body.data,
        });
        return { status: 'Notification sent' };
    }
    async sqsconsumer(body) {
        return { status: 'Notification sent' };
    }
    async sqsConsumerSolde(body) {
        return { status: 'solde sent' };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Publie une notification via Mercure' }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, common_1.Post)('publish'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'recuperer une notification via SQS et envoir vers mercure',
    }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, common_1.Post)('sqsSonsumer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sqsconsumer", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'recuperer le sole via SQS et envoir vers mercure',
    }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, common_1.Post)('sqsconsumer_solde'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sqsConsumerSolde", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [mercure_service_1.MercureService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map