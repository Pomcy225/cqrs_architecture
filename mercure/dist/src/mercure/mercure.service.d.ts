import { ConfigService } from '@nestjs/config';
export declare class MercureService {
    private readonly configService;
    private hubUrl;
    private jwtToken;
    constructor(configService: ConfigService);
    publishNotification(topic: string, data: any): Promise<void>;
}
