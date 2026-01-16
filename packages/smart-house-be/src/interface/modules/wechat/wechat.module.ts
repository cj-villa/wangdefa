import { Module } from '@nestjs/common';
import { SubscriptionService } from '@/core/wechat';
import { SubscriptionController } from './subscription.controller';
import { FireflyModule } from '@/interface/modules/firefly/firefly.module';

@Module({
  imports: [FireflyModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class WechatModule {}
