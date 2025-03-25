import { Module } from '@nestjs/common';

import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { CartService } from './service/carte.servive';
import { CartController } from './controller/cart.controller';

@Module({
  imports: [],
  providers: [
    CartService,
    DBUtil,
    ApiResponseService,
  ],
  controllers: [
    CartController
  ],
})
export class CartModule {}
