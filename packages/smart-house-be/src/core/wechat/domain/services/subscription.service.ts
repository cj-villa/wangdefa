import { Injectable } from '@nestjs/common';
import type { SubscriptionDecryptionRequestBodyDto } from '@/core/wechat';

@Injectable()
export class SubscriptionService {
  onMessage(body: SubscriptionDecryptionRequestBodyDto) {
    console.log('body', body);
    return '';
  }
}
