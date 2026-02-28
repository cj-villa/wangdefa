import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from '@/core/wechat';
import { FireflyModule } from '@/interface/modules/firefly/firefly.module';

@Module({
  imports: [FireflyModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class WechatModule {}
