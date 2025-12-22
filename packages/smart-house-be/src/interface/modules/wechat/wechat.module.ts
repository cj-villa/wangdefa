import { Module } from '@nestjs/common';
import { SubscriptionDecryptionService, SubscriptionService } from '@/core/wechat';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionDecryptionService, SubscriptionService],
})
export class WechatModule {}
