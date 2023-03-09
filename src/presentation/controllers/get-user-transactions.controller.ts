import { Response } from 'express';
import { GetUserTransactionsService } from '../../domain/usecases/get-user-transactions.usecase';
import { TransferTransactionDto } from '../dtos/transfer-transaction.dto';

export class GetUserTransactionsController {
  constructor(
    private readonly getUserTransactionsService: GetUserTransactionsService,
  ) {}

  async getUserTransactions(
    req: string,
    res: Response,
  ): Promise<Response<TransferTransactionDto>> {
    const transactions =
      await this.getUserTransactionsService.getUserTransactions(req);
    return res.json(transactions);
  }
}
