import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/register-user.command';
import { LoginUserQuery } from './queries/login-user.query';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

    async register(email: string, password: string) {
       
    return this.commandBus.execute(new RegisterUserCommand(email, password));
  }

    async login(email: string, password: string) {
      console.log('user', email, password);
    return this.queryBus.execute(new LoginUserQuery(email, password));
  }
}
