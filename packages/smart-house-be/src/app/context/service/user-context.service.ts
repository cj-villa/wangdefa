import { Injectable } from '@nestjs/common';
import { BaseContext } from '@/app/context/service/base';

@Injectable()
export class UserContext extends BaseContext {
  get user() {
    return this.request.user;
  }

  get userId() {
    return this.user.id;
  }
}
