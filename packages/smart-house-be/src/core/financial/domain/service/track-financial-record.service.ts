/** 资金记录服务 */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { TrackFinancialCreateDto } from '@/core/financial/application/dto/track-financial-create.dto';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import { TrackFinancialUpdateDto } from '@/core/financial/application/dto/track-financial-update.dto';
import { TrackFinancialQuery } from '../../application/query/track-financial.query';

@Injectable()
export class TrackFinancialRecordService {
  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectRequest('user')
  private user: JwtUser;

  /** 绑定基金 */
  async create(data: TrackFinancialCreateDto) {
    const trackFinancial = this.trackFinancialRepo.create({
      ...data,
      userId: this.user.userId,
    });
    const isExist = await this.trackFinancialRepo.findOneBy(trackFinancial);
    if (isExist) {
      throw new BadRequestException('当前基金已存在');
    }
    return this.trackFinancialRepo.save(trackFinancial);
  }

  /** 删除基金 */
  async delete(id: string) {
    return this.trackFinancialRepo.softDelete({ id, userId: this.user.userId });
  }

  /** 绑定基金 */
  async update(data: TrackFinancialUpdateDto) {
    const { id, ...rest } = data;
    const isExist = await this.trackFinancialRepo.findOneBy({ userId: this.user.userId, id });
    if (!isExist) {
      throw new BadRequestException('当前基金不存在');
    }
    return this.trackFinancialRepo.update(data.id, rest);
  }

  /** 基金列表 */
  async list(data: TrackFinancialQuery) {
    const { current = 1, pageSize = 10, name, code } = data;
    const query = this.trackFinancialRepo
      .createQueryBuilder('trackFinancial')
      .limit(pageSize)
      .offset((current - 1) * pageSize)
      .where({ userId: this.user.userId });
    if (name) {
      query.andWhere('trackFinancial.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      query.andWhere('trackFinancial.code LIKE :code', { code: `%${code}%` });
    }
    return query.getManyAndCount();
  }

  /** 获取所有基金code */
  async listCode(): Promise<string[]> {
    return this.trackFinancialRepo
      .createQueryBuilder('trackFinancial')
      .select('trackFinancial.code')
      .groupBy('trackFinancial.code')
      .getRawMany()
      .then((res: Array<{ code: string }>) => res.map((i) => i.code));
  }
}
