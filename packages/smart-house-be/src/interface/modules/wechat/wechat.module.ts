import { Module } from '@nestjs/common';
import { SubscriptionService } from '@/core/wechat';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class WechatModule {}
