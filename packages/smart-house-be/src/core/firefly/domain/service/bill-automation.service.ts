import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type Imap, MAIL_INSTANCE } from '@/infrastructure/mail';
import { ParsedMail } from 'mailparser';
import { BillEmailVo, BillCommand, SingleAutomationService } from '@/core/firefly';
import { envConfig } from '@/infrastructure/config';
import { ConfigType } from '@nestjs/config';
import { InjectLogger, type LokiLogger } from '@/interface/decorate/inject-logger';
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
    return `firefly:bill-automation:store-trade:${dayjs().day()}`;
  }

  async storeBill(billEmail: BillEmailVo) {
    const content = billEmail.eBill.toJSON();
    let count = 0;
    for (const item of content) {
      if (!item.tradeNo) {
        continue;
      }
      // 已处理的订单不再处理
      const isExist = await this.redis.sIsMember(this.TradeKey, item.tradeNo);
      if (isExist) {
        continue;
      }
      try {
        await this.redis.sAdd(this.TradeKey, item.tradeNo);
        await this.singleAutomationService.storeHint(JSON.stringify(item));
        count++;
      } catch (e) {
        this.logger.error(`${item.tradeNo} 存储提示失败`, e);
        await this.redis.sRem(this.TradeKey, item.tradeNo);
      }
    }
    this.logger.info(`写入${count}条提示词`);
  }

  async onModuleInit() {
    if (!this.envConfig.mailSwitch) {
      return;
    }
    this.imap?.on('message', async (msg: ParsedMail, markSeen: VoidCallback) => {
      const from = msg.from;
      const to = Array.isArray(msg.to) ? msg.to[0] : msg.to;
      if (from.value[0].address === to.value[0].address) {
        this.logger.info(`收到账单邮件`);
        /** 自己用的，不管高并发了 */
        const billEmailVo = new BillEmailVo(msg.text, msg.attachments, this.billMap);
        await this.storeBill(billEmailVo);
        markSeen();
      }
    });
  }
}
