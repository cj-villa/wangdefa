import type { InsertType } from '@l/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UserModelService, UserValidatorService } from '@/app/user/service';
import type { UserEntity } from '@/entities';
import { md5 } from '@/utils';

@Injectable()
export class AccountService {
  constructor(
    @Inject(UserModelService)
    private userModelService: UserModelService,
    @Inject(UserValidatorService)
    private userValidatorService: UserValidatorService
  ) {}

  getAll() {
    return this.userModelService.getMetaData();
  }

  async registry(user: InsertType<UserEntity>) {
    await this.userValidatorService.userNameConflictValidate(user.userName);
    user.password = md5(user.password);
    return this.userModelService.save(user);
  }
}
