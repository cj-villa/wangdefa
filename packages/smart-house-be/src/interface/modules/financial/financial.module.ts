import { Module } from '@nestjs/common';
import { FundController } from './fund.controller';
import { TrackFund } from '@/core/financial/domain/entities/track-fund.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackFundRecordService } from '@/core/financial/domain/service/track-fund-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrackFund])],
  controllers: [FundController],
  providers: [TrackFundRecordService],
})
export class FinancialModule {}
