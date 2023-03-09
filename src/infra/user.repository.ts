import { ConnectionOptionsReader, DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../data/entities/user.entity';
import { CreateUserDto } from '../presentation/dtos/create-user.dto';
import { AccountEntity } from '../data/entities/account.entity';
import { CreatedUserDto } from '../presentation/dtos/created-user.dto';
import { JwtPayload } from '../utils/jwt-payload.interface';
import { CreatedAccountDto } from '../presentation/dtos/created-account.dto';
import { config } from '../config/auth.config';
import { TransactionEntity } from '../data/entities/transaction.entity';
import { TransferFundsDto } from '../presentation/dtos/transfer-funds.dto';

export class UserRepository {
  private userRepository: Repository<UserEntity>;
  private accountRepository: Repository<AccountEntity>;
  private transactionsRepository: Repository<TransactionEntity>;

  constructor(private connection: DataSource) {
    this.userRepository = this.connection.getRepository(UserEntity);
    this.accountRepository = this.connection.getRepository(AccountEntity);
    this.transactionsRepository =
      this.connection.getRepository(TransactionEntity);
  }

  public async createUserAndAccount({
    username,
    password,
  }: CreateUserDto): Promise<CreatedAccountDto | CreatedUserDto> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      const createUser = await this.userRepository.save(user);

      const createAccount = this.accountRepository.save({
        balance: 100,
        user: createUser,
      });
      await Promise.all([createUser, createAccount]);
    } catch {
      throw 'An error occurred while creating user';
    }

    return;
  }

  public async signInUser({
    username,
    password,
  }: CreatedUserDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { username } });
    const compare = await bcrypt.compare(password, user.password);

    if (user && compare) {
      const payload: JwtPayload = { username };
      const accessToken = jwt.sign(payload, config.secret, {
        expiresIn: 24 * 60 * 60 * 1000,
      });

      return { accessToken };
    } else {
      throw new Error('Please check your login credentials');
    }
  }

  public async getUser(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    return user;
  }

  public async getAccountBalance(username: string): Promise<number> {
    const user = await this.getUser(username);

    const getAccountUser = await this.accountRepository
      .createQueryBuilder()
      .where({ user })
      .execute();

    const balance: number = getAccountUser.map((b) => {
      return b.AccountEntity_balance;
    });

    return balance * 1;
  }

  public async getAccountId(username: string): Promise<string> {
    const user = await this.getUser(username);
    const getAccountUser = await this.accountRepository
      .createQueryBuilder()
      .where({ user })
      .execute();

    const id: string = getAccountUser.map((b) => {
      return b.AccountEntity_id;
    });
    return id.toString();
  }

  public async transferFunds(
    fromUser: string,
    { toUsername, amount }: TransferFundsDto,
  ) {
    const fromUserId = await this.userRepository
      .findOne({
        where: { username: fromUser },
      })
      .then((r) => r.id);

    const toUserId = await this.userRepository
      .findOne({
        where: { username: toUsername },
      })
      .then((r) => r.id)
      .catch((err) => {
        throw new Error('Usuário não encontrado');
      });

    const accountIdFromUser = await this.getAccountId(fromUser);
    const accountIdToUser = await this.getAccountId(toUsername);

    let balanceFrom = await this.getAccountBalance(fromUser);
    let balanceTo = await this.getAccountBalance(toUsername);

    if (balanceFrom > amount * 1 && fromUser != toUsername) {
      const transferFrom = await this.accountRepository
        .createQueryBuilder()
        .update({ balance: (balanceFrom -= amount * 1) })
        .where({ user: fromUserId })
        .execute();
      const transferTo = await this.accountRepository
        .createQueryBuilder()
        .update({ balance: (balanceTo += amount * 1) })
        .where({ user: toUserId })
        .execute();
      const newTransaction = this.transactionsRepository.save({
        value: amount,
        fromUserId: accountIdFromUser,
        toUserId: accountIdToUser,
      });
      Promise.all([transferFrom, transferTo, newTransaction]);
    } else if (balanceFrom < amount) {
      throw new Error('Saldo insuficiente');
    } else if (fromUser === toUsername) {
      throw new Error('Não é possível tranferir para a mesma conta de origem');
    } else {
      throw new Error('Ocorreu um erro inesperado');
    }
  }

  public async getUserTransactions(username: string) {
    const account = await this.getAccountId(username);
    const outFundsTransactions = await this.transactionsRepository
      .createQueryBuilder()
      .where({ fromUserId: account })
      .execute();
    const entryFundsTransactions = await this.transactionsRepository
      .createQueryBuilder()
      .where({ toUserId: account })
      .execute();

    const newObj = {
      out: outFundsTransactions,
      entrys: entryFundsTransactions,
    };

    return newObj;
  }
}
