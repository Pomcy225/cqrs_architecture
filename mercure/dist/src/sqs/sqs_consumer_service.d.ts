import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercureService } from 'src/mercure/mercure.service';
export declare class SqsConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly mercureService;
    private readonly configService;
    private readonly logger;
    private readonly sqsClient;
    private readonly queueUrl;
    private isRunning;
    private activeMessagesCount;
    private stopRequested;
    constructor(mercureService: MercureService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private pollMessages;
    private processMessage;
    private deleteMessage;
    private waitForActiveMessagesToComplete;
}
