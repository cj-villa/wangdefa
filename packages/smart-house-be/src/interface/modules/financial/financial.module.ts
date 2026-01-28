import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { TrackFinancial } from '@/core/financial/domain/entities/track-financial.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackFinancialRecordService } from '@/core/financial/domain/service/track-financial-record.service';
import { FinancialTransaction } from '@/core/financial/domain/entities/track-financial-transaction.entity';
import { TrackFinancialTransactionService } from '@/core/financial/domain/service/track-financial-transaction.service';
import { FinancialTransactionController } from '@/interface/modules/financial/financial-transaction.controller';
import { FinancialNetValueCleanService } from '@/core/financial/domain/service/financial-net-value-clean.service';
import { FinancialNetValueTrendEntity } from '@/core/financial/domain/entities/financial-net-value-trend.entity';
import { FinancialValueCleanService } from '@/core/financial/domain/service/financial-value-clean.service';
import { FinancialScheduleService } from '@/core/financial/domain/service/financial.schedule.service';
import { FinancialValueTrendEntity } from '@/core/financial/domain/entities/financial-value-trend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrackFinancial,
      FinancialTransaction,
      FinancialNetValueTrendEntity,
      FinancialValueTrendEntity,
    ]),
  ],
  controllers: [FinancialController, FinancialTransactionController],
  providers: [
    TrackFinancialRecordService,
    TrackFinancialTransactionService,
    FinancialNetValueCleanService,
    FinancialValueCleanService,
    FinancialScheduleService,
  ],
})
export class FinancialModule {}
