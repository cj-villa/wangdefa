import { ConsoleLogger, Injectable } from '@nestjs/common';
import { SubscriptionDecryptionVO } from '@/core/wechat';
import { type SubscriptionDecryptionCommand, type SubscriptionPayloadCommand } from '@/core/wechat';

@Injectable()
export class SubscriptionDecryptionService {
  private readonly logger = new ConsoleLogger(SubscriptionDecryptionService.name);

  decrypt(
    decryption: SubscriptionDecryptionCommand,
    payload?: SubscriptionPayloadCommand
  ): boolean {
    const subscription = new SubscriptionDecryptionVO(decryption, payload);
    const result = subscription.verify();
    this.logger.debug(`wechat decrypt result: ${result}`);
    return result;
  }

  getPayload(
    decryption: SubscriptionDecryptionCommand,
    payload?: SubscriptionPayloadCommand
  ): SubscriptionPayloadCommand {
    const subscription = new SubscriptionDecryptionVO(decryption, payload);
    return subscription.payload;
  }
}
