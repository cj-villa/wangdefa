import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type Imap, MAIL_INSTANCE } from '@/infrastructure/mail';
import { ParsedMail } from 'mailparser';
import { BillEmailVo, BillCommand, SingleAutomationService } from '@/core/firefly';
import { envConfig } from '@/infrastructure/config';
import { ConfigType } from '@nestjs/config';
import { InjectLogger, type LokiLogger } from '@/interface/middleware/inject-logger';
import { Kv } from '@/infrastructure/consul';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import type { RedisClientType } from 'redis';
import dayjs from 'dayjs';

@Injectable()
export class BillAutomationService implements OnModuleInit {
  @InjectLogger(BillAutomationService.name)
  private readonly logger: LokiLogger;

  @Inject(MAIL_INSTANCE)
  private readonly imap: Imap;

  @Inject(envConfig.KEY)
  private readonly envConfig: ConfigType<typeof envConfig>;

  @Kv('bill_map')
  private readonly billMap: Record<string, BillCommand>;

  @Inject(REDIS_INSTANCE)
  private readonly redis: RedisClientType;

  @Inject()
  private readonly singleAutomationService: SingleAutomationService;

  private get TradeKey() {
    return `firefly:bill:trade:${dayjs().day()}`;
  }

  async storeBill(billEmail: BillEmailVo) {
    const content = billEmail.eBill.toJSON();
    for (const item of content) {
      // 已处理的订单不再处理
      const isExist = await this.redis.sIsMember(this.TradeKey, item.tradeNo);
      if (isExist) {
        continue;
      }
      await this.redis.sAdd(this.TradeKey, item.tradeNo);
      try {
        await this.singleAutomationService.storeHint(JSON.stringify(item));
      } catch (e) {
        this.logger.error(`${item.tradeNo} 存储提示失败`, e);
        await this.redis.sRem(this.TradeKey, item.tradeNo);
      }
    }
  }

  async onModuleInit() {
    if (!this.envConfig.mailSwitch) {
      return;
    }
    this.imap?.on('message', (msg: ParsedMail) => {
      const from = msg.from;
      const to = Array.isArray(msg.to) ? msg.to[0] : msg.to;
      if (from.value[0].address === to.value[0].address) {
        this.logger.info(`收到账单邮件`);
        /** 自己用的，不管高并发了 */
        const billEmailVo = new BillEmailVo(msg.text, msg.attachments, this.billMap);
        this.storeBill(billEmailVo);
      }
    });
  }
}
