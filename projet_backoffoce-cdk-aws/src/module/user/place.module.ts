import { Module } from '@nestjs/common';
import { User } from 'aws-cdk-lib/aws-iam';
import { DBUtil } from 'src/utils/db-utils';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { UserService } from './Service/user.service';
import { UserController } from './controllers/categorie.controller';

@Module({
  imports: [],
  providers: [
   UserService,
    DBUtil,
    ApiResponseService,
  ],
  controllers: [
    UserController,
  ],
})
export class UserModule {}
