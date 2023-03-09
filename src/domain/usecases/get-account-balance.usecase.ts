import { UserRepository } from '../../infra/user.repository';

export class GetAccountBalanceService {
  constructor(private userRepository: UserRepository) {}

  async getAccountBalance(req: string): Promise<number> {
    return await this.userRepository.getAccountBalance(req);
  }
}
