import { Injectable } from '@nestjs/common';
import { SubscriptionDecryptionVO } from '@/core/wechat';
import { type SubscriptionDecryptionCommand, type SubscriptionPayloadCommand } from '@/core/wechat';

@Injectable()
export class SubscriptionDecryptionService {
  decrypt(
    decryption: SubscriptionDecryptionCommand,
    payload?: SubscriptionPayloadCommand
  ): boolean {
    const subscription = new SubscriptionDecryptionVO(decryption, payload);
    return subscription.verify();
  }
}
