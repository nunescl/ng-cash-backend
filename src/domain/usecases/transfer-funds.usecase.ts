import { UserRepository } from '../../infra/user.repository';
import { TransferFundsDto } from '../../presentation/dtos/transfer-funds.dto';

export class TransferFundsService {
  constructor(private userRepository: UserRepository) {}

  async transferFunds(
    transferFundsDto: TransferFundsDto,
    user: string,
  ): Promise<void> {
    return await this.userRepository.transferFunds(user, transferFundsDto);
  }
}
