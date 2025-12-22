import { Inject, Injectable } from '@nestjs/common';
import { TextMessageDto, WechatMessageDto } from '@/core/wechat';
import { create } from 'xmlbuilder2';
import { SingleAutomationService } from '@/core/firefly';

@Injectable()
export class SubscriptionService {
  @Inject(SingleAutomationService)
  private readonly singleAutomationService: SingleAutomationService;

  onMessage(body: WechatMessageDto) {
    console.log(body);
    if (body.MsgType === 'text') {
      return this.handlerTextMessage(body);
    }
    return '';
  }

  async handlerTextMessage(body: TextMessageDto) {
    await this.singleAutomationService.storeHint(body.Content);
    const currentHint = await this.singleAutomationService.getCurrentHint();
    const json = {
      xml: {
        ToUserName: { $: body.FromUserName },
        FromUserName: { $: body.ToUserName },
        CreateTime: Math.floor(Date.now() / 1000),
        MsgType: { $: `当前已缓存的提示提：\n\r${currentHint.join(';')}` },
        Content: { $: '接受成功' },
      },
    };
    return create(json).end({ prettyPrint: true, headless: true });
  }
}
