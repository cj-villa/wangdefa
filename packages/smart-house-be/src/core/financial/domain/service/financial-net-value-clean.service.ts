/** 爬取理财每日的净值 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { FinancialChannel } from '@/core/financial/application/enum/financial-channel';
import { ICBCFinaQuery } from '@/core/financial/application/query/icbc-fina.query';
import { MCBFinaQuery } from '@/core/financial/application/query/mcb-fina.query';
import { MCBFundQuery } from '@/core/financial/application/query/mcb-fund.query';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import { JwtUser } from '@/core/user';
import { InjectLogger } from '@/interface/decorate/inject-logger';
import { InjectRequest } from '@/interface/decorate/inject-request';
import { LokiLogger } from '@/shared/logger';
import { http } from '@/shared/request';
import { stringifyJson } from '@/shared/toolkits/transform';

@Injectable()
export class FinancialNetValueCleanService {
  @InjectRepository(FinancialNetValueTrendEntity)
  private financialTrendRepository: Repository<FinancialNetValueTrendEntity>;

  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectRequest('user')
  private user: JwtUser;

  @InjectLogger(FinancialNetValueCleanService.name)
  private readonly logger: LokiLogger;

  @Inject()
  private readonly trackFinancialTransactionService: TrackFinancialTransactionService;

  // 获取当月净值
  private async getNetValue(code: string, channel: FinancialChannel, pageSize = 10, page = 1) {
    if (channel === FinancialChannel.ICBC_FINA || channel === FinancialChannel.ICBC_CURRENCY) {
      const res: { data: { list: ICBCFinaQuery[] } } = await http.post(
        'https://papi.icbc.com.cn/finance/deposit/consignment/getNetValueList',
        { prodId: code, pageIndex: page, pageSize }
      );
      return (res.data?.list ?? []).map((item) => {
        const trend = new FinancialNetValueTrendEntity();
        trend.date = dayjs(item.workDate).toDate();
        trend.code = code;
        trend.value = item.salePrice;
        return trend;
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
      return (res.body?.data ?? []).map((item) => {
        const trend = new FinancialNetValueTrendEntity();
        trend.date = dayjs(item.znavDat).toDate();
        trend.code = code;
        trend.value = item.znavCtl;
        return trend;
      });
    } else if (channel === FinancialChannel.MCB_FUND) {
      const res: { body: { list: MCBFundQuery[] } } = await http.post(
        'https://fund.cmbchina.com/api/v1/fund/nv/list-paged',
        { fundCode: code, pageIndex: 1, pageSize }
      );
      return (res.body?.list ?? []).map((item) => {
        const trend = new FinancialNetValueTrendEntity();
        trend.date = dayjs(item.updateTime).toDate();
        trend.code = code;
        trend.value = item.netValue;
        return trend;
      });
    }
  }

  /*
   * @description: 获取开始的页码、分页数量、截止时间和最大轮次
   * @param code 理财的编码
   * @param from 清洗的开始时间，不传入时只清洗10天的数据
   */
  private async getCleanParamsData(
    code: string,
    from?: dayjs.ConfigType
  ): Promise<{ deadLine: dayjs.Dayjs; page: number; pageSize: number; round: number } | null> {
    if (!from) {
      return { deadLine: dayjs().subtract(10, 'day'), pageSize: 10, page: 1, round: 1 };
    }
    const dayjsFrom = dayjs(from);
    // 默认每天会获取最新的数据，至少去获取最早的数据是否比现在早即可
    const [[earliestTrend], count] = await this.financialTrendRepository.findAndCount({
      where: { code },
      order: { date: 'asc' },
      take: 1,
    });
    // 不存在数据，直接开刷
    if (!earliestTrend) {
      return {
        deadLine: dayjsFrom,
        pageSize: 30,
        page: 1,
        round: Math.ceil(dayjs().diff(dayjsFrom, 'day') / 30),
      };
    }
    // 已存在比现在早或相同时间的数据，还洗个啥，防止有定时任务不对，洗个一次吧
    const gap = dayjs(earliestTrend.date).diff(dayjsFrom, 'day');
    if (gap <= 0) {
      const latestTrend = await this.financialTrendRepository.findOne({
        where: { code },
        order: { date: 'desc' },
      });
      if (latestTrend && dayjs(latestTrend.date).isSame(dayjsFrom, 'day')) {
        return null;
      }
      return {
        deadLine: dayjsFrom,
        pageSize: 30,
        page: 1,
        round: 1,
      };
    }
    // 把之前已经洗过的数据都跳过
    return {
      deadLine: dayjsFrom,
      pageSize: 30,
      page: Math.ceil(count / 30),
      round: Math.ceil(gap / 30),
    };
  }

  /**
   * @description: 获取理财的净值/7日年化
   * @param code 理财的编码
   * @param from 清洗的开始时间，不传入时只清洗10天的数据
   */
  async fillNetValue(code: string, from?: dayjs.ConfigType) {
    // 自己没有该基金你处理个啥
    const financial = await this.trackFinancialRepo.findOneBy({ code, userId: this.user.userId });
    if (!financial) {
      throw new BadRequestException('基金不存在');
    }

    const paramsData = await this.getCleanParamsData(code, from);
    this.logger.info(`清洗理财净值 ${code} from: ${from} paramsData: ${stringifyJson(paramsData)}`);
    if (!paramsData) {
      return;
    }
    const { deadLine, page, pageSize, round: maxRound } = paramsData;
    let needContinue = true;
    let current = page;
    // 最多12轮，1年
    while (needContinue && current - page < maxRound) {
      // 需要补充的直接就来30天，没有的话就来10天
      const trends = await this.getNetValue(code, financial.channel, pageSize, current++);
      // 没有数据，说明已经完结了
      if (!trends?.length) {
        needContinue = false;
      }
      for (const trend of trends || []) {
        this.logger.info(
          `[${current - page} / ${maxRound}] ${code} save ${trends.length} ${trend.date} trend`
        );
        // 理论不会存在
        const isExist = await this.financialTrendRepository.findOneBy({ date: trend.date, code });
        if (isExist) {
          await this.financialTrendRepository.update({ date: trend.date, code }, trend);
        } else {
          await this.financialTrendRepository.save(trend);
        }
        await this.trackFinancialTransactionService.updateTransactionShares(trend);
        if (!dayjs(trend.date).isAfter(deadLine)) {
          needContinue = false;
        }
      }
      this.logger.info(`${code} 清洗 trend 完成`);
    }
  }
}
