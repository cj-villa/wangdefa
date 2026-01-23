import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FinancialChannel } from '@/core/financial/application/enum/financial-channel';
import { http } from '@/shared/request';
import { ICBCFinaQuery } from '@/core/financial/application/query/icbc-fina.query';
import { MCBFundQuery } from '@/core/financial/application/query/mcb-fund.query';
import { MCBFinaQuery } from '@/core/financial/application/query/mcb-fina.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialTrendEntity } from '@/core/financial/domain/entities/financial-trend.entity';
import { Repository } from 'typeorm';
import { TrackFund } from '@/core/financial/domain/entities/track-fund.entity';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { JwtUser } from '@/core/user';
import dayjs from 'dayjs';
import { fill, groupBy } from 'lodash';
import { fillZero } from '@/shared/toolkits/date';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import type { RedisClientType } from 'redis';
import { checkLock } from '@/shared/lock';

@Injectable()
export class FinancialCleanService {
  @InjectRepository(FinancialTrendEntity)
  private financialTrendRepository: Repository<FinancialTrendEntity>;

  @InjectRepository(TrackFund)
  private readonly trackFundRepo: Repository<TrackFund>;

  @InjectRequest('user')
  private user: JwtUser;

  @Inject(REDIS_INSTANCE)
  private readonly redis: RedisClientType;

  // 获取当月净值
  private async getNetValue(code: string, channel: FinancialChannel, pageSize = 10) {
    if (channel === FinancialChannel.ICBC_FINA) {
      const res: { data: { list: ICBCFinaQuery[] } } = await http.post(
        'https://papi.icbc.com.cn/finance/deposit/consignment/getNetValueList',
        { prodId: code, pageIndex: 1, pageSize }
      );
      const dateMap = groupBy(res.data.list, (item) => dayjs(item.workDate).format('YYYYMM'));
      return Object.entries(dateMap).map(([date, items]) => {
        const trend = new FinancialTrendEntity();
        trend.date = date;
        trend.code = code;
        trend.type = String(items[0].prodType) === '0' ? 'profit' : 'net';
        return items.reduce((_trend, item) => {
          _trend[`salePrice${fillZero(dayjs(item.workDate).date())}`] = Number(item.salePrice);
          return _trend;
        }, trend);
      });
    } else if (channel === FinancialChannel.MCB_FINA) {
      const res: { body: { data: MCBFinaQuery[] } } = await http.post(
        'https://cfweb.paas.cmbchina.com/api/ProductValue/getSAValueByPageOrDate',
        {
          saaCod: 'D07',
          funCod: code,
          pageIndex: 1,
          pageSize,
        }
      );
      const dateMap = groupBy(res.body.data, (item) => dayjs(item.znavDat).format('YYYYMM'));
      return Object.entries(dateMap).map(([date, items]) => {
        const trend = new FinancialTrendEntity();
        trend.date = date;
        trend.code = code;
        return items.reduce((_trend, item) => {
          _trend[`salePrice${fillZero(dayjs(item.znavDat).date())}`] = Number(item.znavCtl);
          return _trend;
        }, trend);
      });
    } else if (channel === FinancialChannel.MCB_FUND) {
      const res: { body: { list: MCBFundQuery[] } } = await http.post(
        'https://fund.cmbchina.com/api/v1/fund/nv/list-paged',
        { fundCode: code, pageIndex: 1, pageSize }
      );
      const dateMap = groupBy(res.body.list, (item) => dayjs(item.updateTime).format('YYYYMM'));
      return Object.entries(dateMap).map(([date, items]) => {
        const trend = new FinancialTrendEntity();
        trend.date = date;
        trend.code = code;
        return items.reduce((_trend, item) => {
          _trend[`salePrice${fillZero(dayjs(item.updateTime).date())}`] = Number(item.netValue);
          return _trend;
        }, trend);
      });
    }
  }

  // 清洗前一天开始的净值
  async fillNetValue(code: string, from?: number) {
    // 当天不再进行处理
    const lock = await checkLock(
      this.redis,
      `financial:${code}`,
      dayjs().add(1, 'day').startOf('day').diff(dayjs(), 'second')
    );
    if (!lock) {
      return;
    }
    // 自己没有该基金你处理个啥
    const fund = await this.trackFundRepo.findOneBy({ code, userId: this.user.userId });
    if (!fund) {
      throw new BadRequestException('基金不存在');
    }
    let round = 0;
    const fromDate = dayjs(from);
    const date = fromDate.format('YYYYMM');
    const field = `salePrice${fillZero(fromDate.date())}`;
    let needContinue = true;
    // 最多12轮，1年
    while (needContinue && round++ < 13) {
      // 需要补充的直接就来30天，没有的话就来10天
      const trends = await this.getNetValue(code, fund.channel, from ? 30 : 10);
      for (const trend of trends) {
        await this.financialTrendRepository.upsert(trend, {
          conflictPaths: ['date', 'code'],
        });
      }
      if (!from || trends.find((item) => item.date === date)?.[field]) {
        needContinue = false;
      }
    }
  }
}
