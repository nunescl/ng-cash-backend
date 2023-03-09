import { Response, Request } from 'express';
import { CreatedUserDto } from '../dtos/created-user.dto';
import { SignInUserService } from '../../domain/usecases/signin-user.usecase';

interface ICreateUserBody extends Request {
  body: CreatedUserDto;
}

export class SignInUserController {
  constructor(private readonly signInUserService: SignInUserService) {}

  async signInUser(
    { body }: ICreateUserBody,
    res: Response,
  ): Promise<Response<{ accessToken: string }>> {
    const token = await this.signInUserService.signInUser(body);

    return res.json(token);
  }
}
