import { Module } from '@nestjs/common';
import { FundController } from './fund.controller';
import { TrackFund } from '@/core/financial/domain/entities/track-fund.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackFundRecordService } from '@/core/financial/domain/service/track-fund-record.service';
import { FundTransaction } from '@/core/financial/domain/entities/track-fund-transaction.entity';
import { TrackFundTransactionService } from '@/core/financial/domain/service/track-fund-transaction.service';
import { FundTransactionController } from '@/interface/modules/financial/fund-transaction.controller';
import { FinancialCleanService } from '@/core/financial/domain/service/financial-clean.service';
import { FinancialTrendEntity } from '@/core/financial/domain/entities/financial-trend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackFund, FundTransaction, FinancialTrendEntity])],
  controllers: [FundController, FundTransactionController],
  providers: [TrackFundRecordService, TrackFundTransactionService, FinancialCleanService],
})
export class FinancialModule {}
