import { Module } from '@nestjs/common';
import { FireflyController } from './firefly.controller';
import { BasicInfoService, BillAutomationService, SingleAutomationService } from '@/core/firefly';

@Module({
  imports: [],
  controllers: [FireflyController],
  providers: [BasicInfoService, SingleAutomationService, BillAutomationService],
})
export class FireflyModule {}
