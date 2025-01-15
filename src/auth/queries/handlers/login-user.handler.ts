import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginUserQuery } from '../login-user.query';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@QueryHandler(LoginUserQuery)
export class LoginUserHandler implements IQueryHandler<LoginUserQuery> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: LoginUserQuery): Promise<string> {
    const user = await this.userRepository.findOne({
        where: { email: query.email },
       
    });
      
    if (!user || !(await bcrypt.compare(query.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return 'Login successful';
  }
}
