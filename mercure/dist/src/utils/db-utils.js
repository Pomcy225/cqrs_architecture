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
exports.DBUtil = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const client_ssm_1 = require("@aws-sdk/client-ssm");
const pg_1 = require("pg");
let DBUtil = class DBUtil {
    constructor(configService) {
        this.configService = configService;
        this.secretsManager = new client_secrets_manager_1.SecretsManagerClient({
            region: this.configService.get('AWS_REGION'),
        });
        this.ssm = new client_ssm_1.SSMClient({
            region: this.configService.get('AWS_REGION'),
        });
        this.environment = this.configService.get('ENVIRONMENT');
    }
    async getSSMParameter(paramName) {
        const response = await this.ssm.send(new client_ssm_1.GetParameterCommand({
            Name: `/lebedoo/${this.environment}/${paramName}`,
            WithDecryption: true,
        }));
        return response.Parameter.Value;
    }
    async getConnectionConfig(prefix) {
        try {
            const [credentialsArn, proxyEndpoint, dbName, port] = await Promise.all([
                this.getSSMParameter(`${prefix}/rds-secret-arn`),
                this.getSSMParameter(`${prefix}/rds-proxy-endpoint`),
                this.getSSMParameter(`${prefix}/rds-db-name`),
                this.getSSMParameter(`${prefix}/rds-db-port`),
            ]);
            const secretResponse = await this.secretsManager.send(new client_secrets_manager_1.GetSecretValueCommand({ SecretId: credentialsArn }));
            const { username, password } = JSON.parse(secretResponse.SecretString);
            return {
                host: proxyEndpoint,
                port: +port,
                user: username,
                password: password,
                database: dbName,
                ssl: {
                    rejectUnauthorized: false,
                },
            };
        }
        catch (error) {
            console.error('Erreur de configuration de la connexion à la base de données:', error);
            throw error;
        }
    }
    async query(prefix, text, params) {
        const config = await this.getConnectionConfig(prefix);
        const client = new pg_1.Client(config);
        try {
            await client.connect();
            const result = await client.query(text, params);
            return result;
        }
        finally {
            await client.end();
        }
    }
    async placeServiceQuery(text, params) {
        return await this.query('place-service', text, params);
    }
    async loyaltyServiceQuery(text, params) {
        return await this.query('loyalty-service', text, params);
    }
    async bedooMallServiceQuery(text, params) {
        return await this.query('bedoo-mall-service', text, params);
    }
    async adminServiceQuery(text, params) {
        return await this.query('admin-access-mgmt', text, params);
    }
    async endUserServiceQuery(text, params) {
        return await this.query('end-user-service', text, params);
    }
    async walletServiceQuery(text, params) {
        return await this.query('wallet-transaction-service', text, params);
    }
};
exports.DBUtil = DBUtil;
exports.DBUtil = DBUtil = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DBUtil);
//# sourceMappingURL=db-utils.js.map