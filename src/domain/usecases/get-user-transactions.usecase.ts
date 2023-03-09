import { UserRepository } from '../../infra/user.repository';

export class GetUserTransactionsService {
  constructor(private userRepository: UserRepository) {}
  async getUserTransactions(req: string) {
    return await this.userRepository.getUserTransactions(req);
  }
}
