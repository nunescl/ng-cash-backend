export class TransferTransactionDto {
  id: string;
  value: number;
  createdAt: Date;
  fromUserId: string;
  toUserId: string;
}
