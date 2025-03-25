"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mercure_module_1 = require("./mercure/mercure.module");
const config_1 = require("@nestjs/config");
const sqs_consumer_service_1 = require("./sqs/sqs_consumer_service");
const mercure_service_1 = require("./mercure/mercure.service");
const sqs_consumer_solde_service_1 = require("./sqs_solde/sqs_consumer_solde_service");
const db_utils_1 = require("./utils/db-utils");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                ignoreEnvFile: true,
                isGlobal: true,
            }),
            mercure_module_1.MercureModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            sqs_consumer_service_1.SqsConsumerService,
            mercure_service_1.MercureService,
            sqs_consumer_solde_service_1.SqsConsumerSoldeService,
            db_utils_1.DBUtil,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map