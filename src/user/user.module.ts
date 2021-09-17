import { UserDeleteService } from './query/userDelete.query.service';
import { UserUpdateService } from './query/userUpdate.query.service';
import { AuthModule } from './../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserReadService } from './query/userRead.query.service';
import { UserCreateService } from './query/userCreate.query.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    UserService,
    UserReadService,
    UserCreateService,
    UserUpdateService,
    UserDeleteService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
