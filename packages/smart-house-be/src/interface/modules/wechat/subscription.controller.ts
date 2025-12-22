import { All, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { Public } from 'src/interface/guard';
import {
  type SubscriptionDecryptionRequestQueryDto,
  DecryptQuery,
  DecryptBody,
  SubscriptionService,
} from '@/core/wechat';

@Controller('/api/open/wechat')
export class SubscriptionController {
  @Inject() private readonly subscriptionService: SubscriptionService;

  @Public()
  @Get('')
  verify(@DecryptQuery() query: SubscriptionDecryptionRequestQueryDto) {
    return query.echostr;
  }

  @Public()
  @Post('')
  onMessage(@DecryptBody() body) {
    return this.subscriptionService.onMessage(body);
  }

  @Public()
  @All('test')
  async test(@Query() query: any) {
    return 'test';
  }
}
