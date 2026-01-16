import { Module } from '@nestjs/common';
import { FireflyController } from './firefly.controller';
import {
  BasicInfoService,
  BillAutomationService,
  SingleAutomationService,
  JournalPretreatmentService,
} from '@/core/firefly';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsertJournalService } from '@/core/firefly/domain/service/insert-juornal.service';
import { FireflyParsingRules } from '@/core/firefly/domain/entities/firefly-parsing-rules.entity';
import { JournalMeta } from '@/core/firefly/domain/entities/journal-meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JournalMeta], '__firefly__'),
    // TypeOrmModule.forFeature([JournalMeta]),
    TypeOrmModule.forFeature([FireflyParsingRules]),
  ],
  controllers: [FireflyController],
  providers: [
    BasicInfoService,
    SingleAutomationService,
    BillAutomationService,
    JournalPretreatmentService,
    InsertJournalService,
  ],
  exports: [SingleAutomationService],
})
export class FireflyModule {}
