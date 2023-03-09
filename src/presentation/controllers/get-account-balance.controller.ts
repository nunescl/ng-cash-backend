import { Response } from 'express';
import { GetAccountBalanceService } from '../../domain/usecases/get-account-balance.usecase';

export class GetAccountBalanceController {
  constructor(
    private readonly getAccountBalanceService: GetAccountBalanceService,
  ) {}

  async getAccountBalance(
    req: string,
    res: Response,
  ): Promise<Response<number>> {
    const balance = await this.getAccountBalanceService.getAccountBalance(req);
    return res.json(balance);
  }
}
