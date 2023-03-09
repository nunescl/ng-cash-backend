import { UserRepository } from '../../infra/user.repository';
import { CreatedUserDto } from '../../presentation/dtos/created-user.dto';
import { CreateUserDto } from '../../presentation/dtos/create-user.dto';
import { CreateAccountDto } from '../../presentation/dtos/create-account.dto';

export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreatedUserDto | CreateAccountDto> {
    return await this.userRepository.createUserAndAccount(createUserDto);
  }
}
