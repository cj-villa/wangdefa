import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtUser } from '@/core/user';
import { Token } from '@/core/token';
import { randomUUID } from 'crypto';
import { InjectRequest } from '@/interface/decorate/inject-request';

@Injectable()
export class TokenManageService {
  @InjectRepository(Token)
  private tokensRepository: Repository<Token>;

  @InjectRequest('user')
  private user: JwtUser;

  create(name: string) {
    const token = this.tokensRepository.create({
      userId: this.user.userId,
      name,
      token: randomUUID(),
    });
    return this.tokensRepository.save(token);
  }

  async delete(id: number) {
    const token = await this.tokensRepository.findOneBy({ id });
    if (token?.userId !== this.user.userId) {
      return {
        raw: [],
        affected: 1,
      };
    }
    return this.tokensRepository.delete(id);
  }
}
