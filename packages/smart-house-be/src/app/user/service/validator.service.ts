/*
 * @author: chenjieLu
 * @description: 对用户的操作进行基础的校验
 */
import { Inject } from '@nestjs/common';
import { UserModelService } from '@/app/user/service/model.service';
import { BusinessException } from '@/constant/exceptions';
import type { UserEntity } from '@/entities';

export class UserValidatorService {
  constructor(
    @Inject(UserModelService)
    private userModelService: UserModelService
  ) {}

  /**
   * 检查用户名是否已存在
   * @param {string} userName - 用户名
   */
  async userNameConflictValidate(userName: UserEntity['userName']) {
    const userList = await this.userModelService.getMetaData({
      userName,
    });
    if (userList.length) {
      throw new BusinessException(`用户名 ${userName} 已存在`);
    }
  }
}
