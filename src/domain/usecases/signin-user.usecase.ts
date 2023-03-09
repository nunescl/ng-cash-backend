import { UserRepository } from '../../infra/user.repository';
import { CreatedUserDto } from '../../presentation/dtos/created-user.dto';

export class SignInUserService {
  constructor(private userRepository: UserRepository) {}

  async signInUser(
    createdUserDto: CreatedUserDto,
  ): Promise<{ accessToken: string }> {
    return await this.userRepository.signInUser(createdUserDto);
  }
}
