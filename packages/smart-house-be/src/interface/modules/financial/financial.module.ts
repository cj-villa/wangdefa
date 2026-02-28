import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialController } from './financial.controller';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { FinancialAnalyzeService } from '@/core/financial/domain/service/financial-analyze.service';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { FinancialNetValueService } from '@/core/financial/domain/service/financial-net-value.serivce';
import { FinancialValueCleanService } from '@/core/financial/domain/service/financial-value-clean.service';
import { FinancialValueSummaryService } from '@/core/financial/domain/service/financial-value-summary.service';
import { FinancialScheduleService } from '@/core/financial/domain/service/financial.schedule.service';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import { FinancialAnalyzeController } from '@/interface/modules/financial/financial-analyze.controller';
import { FinancialNetValueController } from '@/interface/modules/financial/financial-net-value.controller';
import { FinancialTransactionController } from '@/interface/modules/financial/financial-transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrackFinancial,
      FinancialTransaction,
      FinancialNetValueTrendEntity,
      FinancialValueTrendEntity,
    ]),
  ],
  controllers: [
    FinancialController,
    FinancialTransactionController,
    FinancialNetValueController,
    FinancialAnalyzeController,
  ],
  providers: [
    TrackFinancialRecordService,
    TrackFinancialTransactionService,
    FinancialNetValueCleanService,
    FinancialValueCleanService,
    FinancialScheduleService,
    FinancialNetValueService,
    FinancialValueSummaryService,
    FinancialAnalyzeService,
  ],
})
export class FinancialModule {}
