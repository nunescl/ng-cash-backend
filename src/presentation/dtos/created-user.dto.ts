import { UserEntity } from '../../data/entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class CreatedUserDto extends CreateUserDto {
  id: string;
  account: string;

  constructor(userEntity: UserEntity) {
    super();
    this.id = userEntity.id;
    this.username = userEntity.username;
    this.password = userEntity.password;
    this.account = userEntity.account;
  }
}
