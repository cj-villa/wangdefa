import { Module } from '@nestjs/common';
import { SubscriptionDecryptionService } from '@/core/wechat';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionDecryptionService],
})
export class WechatModule {}
