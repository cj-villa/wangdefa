import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FinancialValueCleanService } from '@/core/financial/domain/service/financial-value-clean.service';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import dayjs from 'dayjs';
import { InjectLogger, LokiLogger } from '@/interface/decorate/inject-logger';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';

@Injectable()
export class FinancialScheduleService {
  @Inject()
  private readonly financialValueCleanService: FinancialValueCleanService;

  @Inject()
  private readonly trackFinancialRecordService: TrackFinancialRecordService;

  @Inject()
  private readonly financialNetValueCleanService: FinancialNetValueCleanService;

  @InjectLogger(FinancialScheduleService.name)
  private readonly logger: LokiLogger;

  /** 每天计算一次前一天的基金价值 */
  @Cron('0 0 4 * * *')
  async calcFinancialValue() {
    const codes = await this.trackFinancialRecordService.listCode();
    for (const code of codes) {
      this.logger.info(`计算基金 ${code} 的价值`);
      const current = dayjs().subtract(1, 'day');
      try {
        await this.financialNetValueCleanService.fillNetValue(code, current);
        await this.financialValueCleanService.calcFinancialValue(code, current);
        this.logger.info(`计算基金 ${code} 的价值完成`);
      } catch (error) {
        this.logger.error(`计算基金 ${code} 的价值失败: ${error.message}`);
      }
    }
  }
}
