import { IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}$/, {
    message: 'password is too week',
  })
  password: string;
}
