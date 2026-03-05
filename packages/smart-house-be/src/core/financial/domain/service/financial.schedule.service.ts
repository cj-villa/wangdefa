import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { FinancialValueCleanService } from '@/core/financial/domain/service/financial-value-clean.service';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import { InjectLogger, LokiLogger } from '@/interface/decorate/inject-logger';

@Injectable()
export class FinancialScheduleService {
  @Inject()
  private readonly financialValueCleanService: FinancialValueCleanService;

  @Inject()
  private readonly trackFinancialRecordService: TrackFinancialRecordService;

  @Inject()
  private readonly financialNetValueCleanService: FinancialNetValueCleanService;

  @InjectRepository(TrackFinancial)
  private readonly trackFinancialRepo: Repository<TrackFinancial>;

  @InjectLogger(FinancialScheduleService.name)
  private readonly logger: LokiLogger;

  /** 每天计算一次前一天的基金价值 */
  // @Cron('0 15 * * * *')
  @Cron('0 0 4 * * *')
  async calcFinancialValue(delay?: number, forceRefreshNetValue?: number) {
    const codes = await this.trackFinancialRecordService.listCode();
    for (const code of codes) {
      this.logger.info(`计算基金 ${code} 的价值`);
      // 有些T+2，洗两天
      try {
        const financial = await this.trackFinancialRepo.findOneBy({ code });

        const current = dayjs().subtract(delay ?? financial.delay ?? 2, 'day');
        // 刷新净值
        await this.financialNetValueCleanService.fillNetValue(code, current, forceRefreshNetValue);
        // 刷新价值
        await this.financialValueCleanService.calcFinancialValue(code, current);
        this.logger.info(`计算基金 ${code} 的价值完成`);
      } catch (error) {
        this.logger.error(`计算基金 ${code} 的价值失败`, error);
      }
    }
  }
}
