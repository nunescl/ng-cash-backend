import { CreateUserService } from '../../domain/usecases/create-user.usecase';
import { Response, Request } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreatedUserDto } from '../dtos/created-user.dto';
import { CreatedAccountDto } from '../dtos/created-account.dto';

interface ICreateUserBody extends Request {
  body: CreateUserDto;
}

export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  async createUser(
    { body: { username, password } }: ICreateUserBody,
    res: Response,
  ): Promise<Response<CreatedUserDto | CreatedAccountDto>> {
    const user = await this.createUserService.createUser({
      username,
      password,
    });
    return res.json(user);
  }
}
