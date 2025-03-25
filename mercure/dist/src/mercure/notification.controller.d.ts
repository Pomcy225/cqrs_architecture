import { MercureService } from './mercure.service';
export declare class NotificationController {
    private readonly mercureService;
    constructor(mercureService: MercureService);
    sendNotification(body: {
        topic: string;
        data: any;
    }): Promise<{
        status: string;
    }>;
    sqsconsumer(body: {
        data: any;
    }): Promise<{
        status: string;
    }>;
    sqsConsumerSolde(body: {
        data: any;
    }): Promise<{
        status: string;
    }>;
}
