import { NextFunction, Router, Request, Response } from 'express';
import { AppDataSource } from '../data/config/data-source';
import { CreateUserService } from '../domain/usecases/create-user.usecase';
import { SignInUserService } from '../domain/usecases/signin-user.usecase';
import { CreateUserController } from '../presentation/controllers/create-user.controller';
import { SignInUserController } from '../presentation/controllers/signin-user.controller';
import { UserRepository } from './user.repository';
import { verifyToken as auth } from '../utils/auth.middleware';
import { GetAccountBalanceController } from '../presentation/controllers/get-account-balance.controller';
import { GetAccountBalanceService } from '../domain/usecases/get-account-balance.usecase';
import { TransferFundsController } from '../presentation/controllers/transfer-funds.controller';
import { TransferFundsService } from '../domain/usecases/transfer-funds.usecase';
import { GetUserTransactionsController } from '../presentation/controllers/get-user-transactions.controller';
import { GetUserTransactionsService } from '../domain/usecases/get-user-transactions.usecase';

const router = Router();

const createUserController = new CreateUserController(
  new CreateUserService(new UserRepository(AppDataSource)),
);
const signInUserController = new SignInUserController(
  new SignInUserService(new UserRepository(AppDataSource)),
);
const getAccountBalanceController = new GetAccountBalanceController(
  new GetAccountBalanceService(new UserRepository(AppDataSource)),
);

const transferFundsController = new TransferFundsController(
  new TransferFundsService(new UserRepository(AppDataSource)),
);

const getUserTransactions = new GetUserTransactionsController(
  new GetUserTransactionsService(new UserRepository(AppDataSource)),
);

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  createUserController.createUser(req, res).catch((error: Error) => {
    next(error);
  });
});

router.post('/signin', (req: Request, res: Response, next: NextFunction) => {
  signInUserController.signInUser(req, res).catch((error: Error) => {
    next(error);
  });
});

router.get('/', auth, (req: Request, res: Response, next: NextFunction) => {
  const user = req['user'];
  getAccountBalanceController
    .getAccountBalance(user.username, res)
    .catch((error: Error) => {
      next(error);
    });
});

router.patch(
  '/transfer',
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    const user = req['user'];
    transferFundsController
      .transferFunds(req, res, user.username)
      .catch((error: Error) => {
        next(error);
      });
  },
);

router.get(
  '/transactions',
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    const user = req['user'];
    getUserTransactions
      .getUserTransactions(user.username, res)
      .catch((error: Error) => {
        next(error);
      });
  },
);

export default router;
