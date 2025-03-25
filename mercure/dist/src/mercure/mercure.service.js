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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercureService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const http = require("http");
const querystring = require("querystring");
let MercureService = class MercureService {
    constructor(configService) {
        this.configService = configService;
        this.hubUrl = 'https://148.113.143.59:8091/.well-known/mercure';
        this.jwtToken = this.configService.get('MERCURE_HUB_JWT_KEY');
    }
    async publishNotification(topic, data) {
        const token = this.configService.get('MERCURE_HUB_JWT_KEY');
        if (!token) {
            throw new Error('JWT token is missing');
        }
        try {
            const postData = querystring.stringify({
                topic: topic,
                data: JSON.stringify(data),
            });
            const options = {
                hostname: '148.113.143.59',
                port: 8091,
                path: '/.well-known/mercure',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData),
                },
            };
            const req = http.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    console.log('[publishNotification] Response received:', responseBody);
                });
            });
            req.on('error', (error) => {
                console.error('[publishNotification] HTTP request error:', error);
            });
            req.write(postData);
            req.end();
            console.log('[publishNotification] Notification sent successfully');
        }
        catch (error) {
            console.error('[publishNotification] Error:', error);
            throw error;
        }
    }
};
exports.MercureService = MercureService;
exports.MercureService = MercureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MercureService);
//# sourceMappingURL=mercure.service.js.map