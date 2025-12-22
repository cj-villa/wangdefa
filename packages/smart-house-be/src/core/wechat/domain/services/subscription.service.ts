import { Injectable } from '@nestjs/common';
import { TextMessageDto, WechatMessageDto } from '@/core/wechat';
import { create } from 'xmlbuilder2';

@Injectable()
export class SubscriptionService {
  onMessage(body: WechatMessageDto) {
    console.log(body);
    if (body.MsgType === 'text') {
      return this.handlerTextMessage(body);
    }
    return '';
  }

  handlerTextMessage(body: TextMessageDto) {
    console.log('body', body);
    const json = {
      xml: {
        ToUserName: { $: body.FromUserName },
        FromUserName: { $: body.ToUserName },
        CreateTime: Math.floor(Date.now() / 1000),
        MsgType: { $: 'text' },
        Content: { $: '接受成功' },
      },
    };
    const xml = create(json).end({ prettyPrint: true, headless: true });
    console.log('xml', xml);
    return xml;
  }
}
