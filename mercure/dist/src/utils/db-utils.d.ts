import { ConfigService } from '@nestjs/config';
export declare class DBUtil {
    private configService;
    private secretsManager;
    private ssm;
    private environment;
    constructor(configService: ConfigService);
    private getSSMParameter;
    private getConnectionConfig;
    private query;
    placeServiceQuery(text: string, params?: any[]): Promise<any>;
    loyaltyServiceQuery(text: string, params?: any[]): Promise<any>;
    bedooMallServiceQuery(text: string, params?: any[]): Promise<any>;
    adminServiceQuery(text: string, params?: any[]): Promise<any>;
    endUserServiceQuery(text: string, params?: any[]): Promise<any>;
    walletServiceQuery(text: string, params?: any[]): Promise<any>;
}
