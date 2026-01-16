import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TrackFund } from '@/core/financial/domain/entities/track-fund.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { TrackFundCreateDto } from '@/core/financial/application/dto/track-fund-create.dto';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { TrackFundUpdateDto } from '@/core/financial/application/dto/track-fund-update.dto';
import { TrackFundQuery } from '../../application/query/track-fund.query';

@Injectable()
export class TrackFundRecordService {
  @InjectRepository(TrackFund)
  private readonly trackFundRepo: Repository<TrackFund>;

  @InjectRequest('user')
  private user: JwtUser;

  /** 绑定基金 */
  async create(data: TrackFundCreateDto) {
    console.log('this.user.userId', this.user.userId);
    const trackFund = this.trackFundRepo.create({
      ...data,
      userId: this.user.userId,
    });
    const isExist = await this.trackFundRepo.findOneBy(trackFund);
    if (isExist) {
      throw new BadRequestException('当前基金已存在');
    }
    return this.trackFundRepo.save(trackFund);
  }

  /** 删除基金 */
  async delete(id: string) {
    return this.trackFundRepo.softDelete({ id, userId: this.user.userId });
  }

  /** 绑定基金 */
  async update(data: TrackFundUpdateDto) {
    const { id, ...rest } = data;
    const isExist = await this.trackFundRepo.findOneBy({ userId: this.user.userId, id });
    if (!isExist) {
      throw new BadRequestException('当前基金不存在');
    }
    return this.trackFundRepo.update(data.id, rest);
  }

  /** 绑定基金 */
  async list(data: TrackFundQuery) {
    const { current = 1, pageSize = 10, name, code } = data;
    const query = this.trackFundRepo
      .createQueryBuilder('trackFund')
      .limit(pageSize)
      .offset((current - 1) * pageSize)
      .where({ userId: this.user.userId });
    if (name) {
      query.andWhere('trackFund.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      query.andWhere('trackFund.code LIKE :code', { code: `%${code}%` });
    }
    console.log('sql', query.getSql());
    return query.getManyAndCount();
  }
}
