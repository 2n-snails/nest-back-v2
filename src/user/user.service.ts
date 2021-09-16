import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UserCreateService } from './query/userCreate.query.service';
import { UserReadService } from './query/userRead.query.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userCreateService: UserCreateService,
    private readonly userReadService: UserReadService,
  ) {}
  async findUserById(id: number | string): Promise<User | undefined> {
    return await this.userReadService.findOneUserById(id);
  }

  async joinUser(id: number | string, nick: string, provider: string) {
    return await this.userCreateService.createUser(id, nick, provider);
  }
}
