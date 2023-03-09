import { CreateAccountDto } from './create-account.dto';

export class CreatedAccountDto extends CreateAccountDto {
  balance: number;
  id: string;
}
