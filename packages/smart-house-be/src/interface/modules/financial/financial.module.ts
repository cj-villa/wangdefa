import { Module } from '@nestjs/common';
import { FundController } from './fund.controller';
import { TrackFund } from '@/core/financial/domain/entities/track-fund.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackFundRecordService } from '@/core/financial/domain/service/track-fund-record.service';
import { FundTransaction } from '@/core/financial/domain/entities/track-fund-transaction.entity';
import { TrackFundTransactionService } from '@/core/financial/domain/service/track-fund-transaction';
import { FundTransactionController } from '@/interface/modules/financial/fund-transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrackFund, FundTransaction])],
  controllers: [FundController, FundTransactionController],
  providers: [TrackFundRecordService, TrackFundTransactionService],
})
export class FinancialModule {}
