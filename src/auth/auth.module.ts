import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';
import { LoginUserHandler } from './queries/handlers/login-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [AuthController],
  providers: [AuthService, RegisterUserHandler, LoginUserHandler],
})
export class AuthModule {}
