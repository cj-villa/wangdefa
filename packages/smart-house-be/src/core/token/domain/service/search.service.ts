import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '@/core/token';
import { Repository } from 'typeorm';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser, UserService } from '@/core/user';

@Injectable()
export class TokenSearchService {
  @InjectRepository(Token)
  private tokensRepository: Repository<Token>;

  @InjectRequest('user')
  private user: JwtUser;

  @Inject()
  private userService: UserService;

  list(current: number = 1, limit: number = 10) {
    return this.tokensRepository.findAndCount({
      where: {
        userId: this.user.userId,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (current - 1) * limit,
      take: limit,
    });
  }

  async getUserByToken(token: string) {
    const tokenEntity = await this.tokensRepository.findOneBy({ token });
    if (!tokenEntity?.userId) {
      return null;
    }
    return this.userService.getUserById(tokenEntity.userId);
  }
}
