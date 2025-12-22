import { Module } from '@nestjs/common';
import { SubscriptionService } from '@/core/wechat';
import { SingleAutomationService } from '@/core/firefly';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SingleAutomationService],
})
export class WechatModule {}
