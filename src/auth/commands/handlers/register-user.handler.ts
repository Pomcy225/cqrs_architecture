import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const hashedPassword = await bcrypt.hash(command.password, 10);
    const user = this.userRepository.create({
      email: command.email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
