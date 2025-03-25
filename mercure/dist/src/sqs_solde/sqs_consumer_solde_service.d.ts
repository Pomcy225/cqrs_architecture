import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercureService } from 'src/mercure/mercure.service';
import { DBUtil } from 'src/utils/db-utils';
export declare class SqsConsumerSoldeService implements OnModuleInit, OnModuleDestroy {
    private readonly mercureService;
    private readonly dbUtils;
    private readonly configService;
    private readonly logger;
    private readonly sqsClient;
    private readonly queueUrl;
    private isRunning;
    private activeMessagesCount;
    private stopRequested;
    constructor(mercureService: MercureService, dbUtils: DBUtil, configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    pollMessages(): Promise<void>;
    private processMessage;
    deleteMessage(receiptHandle: string): Promise<void>;
    private waitForActiveMessagesToComplete;
}
