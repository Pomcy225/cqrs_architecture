import { Module } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { ProviderService } from './services/provider.service';
import { TypeActionService } from './services/type_action.service';
import { TypeServiceService } from './services/type_service.service';
import { PlafondService } from './services/plafond.service';
import { ProviderController } from './controllers/provider.controller';
import { TypeServiceController } from './controllers/type_service.controller';
import { TypeActionController } from './controllers/type_action.controller';
import { PlafondController } from './controllers/plafond.controller';

@Module({
  providers: [
    DBUtil,
    ApiResponseService,
    PlafondService,
    ProviderService,
    TypeActionService,
    TypeServiceService,
  ],
  controllers: [
    ProviderController,
    TypeActionController,
    TypeServiceController,
    PlafondController,
  ],
})
export class PlafondModule {}
