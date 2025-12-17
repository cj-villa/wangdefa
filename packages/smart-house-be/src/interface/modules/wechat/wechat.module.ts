import { Module } from '@nestjs/common';
import { WechatController } from '@/interface/modules/wechat/wechat.controller';

@Module({
  controllers: [WechatController],
})
export class WechatModule {}
