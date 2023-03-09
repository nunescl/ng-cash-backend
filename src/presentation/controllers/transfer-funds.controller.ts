import { Response, Request } from 'express';
import { TransferFundsService } from '../../domain/usecases/transfer-funds.usecase';

interface ITransferFundsBody extends Request {
  body: { amount: number; toUsername: string };
}

export class TransferFundsController {
  constructor(private readonly transferFundsService: TransferFundsService) {}

  async transferFunds(
    { body }: ITransferFundsBody,
    res: Response,
    user: string,
  ): Promise<Response<string>> {
    await this.transferFundsService.transferFunds(body, user);
    return res.status(200).json('Success');
  }
}
