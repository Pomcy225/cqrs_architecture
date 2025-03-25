import { Module } from '@nestjs/common';

import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { DispatchService } from './services/dispatch.service';
import { LivreurController } from './controllers/livreur.controller';
import { DispatchController } from './controllers/dispatch.controller';
import { LivreurService } from './services/livreur.service';

@Module({
  imports: [],
  providers: [DispatchService,LivreurService, DBUtil, ApiResponseService],
  controllers: [LivreurController,DispatchController],
})
export class livraisonModule {}
