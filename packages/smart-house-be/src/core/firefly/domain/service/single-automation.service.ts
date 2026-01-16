import { Inject, Injectable } from '@nestjs/common';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import type { RedisClientType } from 'redis';
import dayjs from 'dayjs';
import { Cron } from '@nestjs/schedule';
import { createLogger } from '@/shared/logger';
import { checkLock } from '@/shared/lock';
import { DIFY_BASE_SERVICE, DifyBaseService } from '@/infrastructure/dify';
import { parseJson } from '@/shared/toolkits/transform';
import { JournalPretreatmentService } from './journal-pretreatment.service';
import { JournalCommand } from '../../application/commands/journal-command';
import { InsertJournalService } from '@/core/firefly/domain/service/insert-juornal.service';

@Injectable()
export class SingleAutomationService {
  private readonly logger = createLogger(SingleAutomationService.name);

  @Inject(DIFY_BASE_SERVICE) private readonly difyBaseModule: DifyBaseService;

  @Inject()
  private readonly journalPretreatmentService: JournalPretreatmentService;

  @Inject()
  private readonly insertJournalService: InsertJournalService;

  @Inject(REDIS_INSTANCE)
  private readonly redis: RedisClientType;

  private get HintKey() {
    return `firefly:single:hint:${dayjs().day()}`;
  }

  private readonly DifyHintPopLength = 5;

  /** 缓存提示词至redis */
  async storeHint(hint: string) {
    const isNew = !(await this.redis.exists(this.HintKey));
    await this.redis.lPush(this.HintKey, hint);
    if (isNew) {
      // 两天过期
      await this.redis.expire(this.HintKey, 3600 * 48);
    }
  }

  /** 获取提示词 */
  async getCurrentHint(offset = 0, length?: number) {
    return this.redis.lRange(this.HintKey, offset, length ? offset + length : -1);
  }

  /** 弹出提示词 */
  private async popHint(length: number) {
    return this.redis.lmPop(this.HintKey, 'LEFT', { COUNT: length });
  }

  private async askHintFromDify(hints?: string[]) {
    return this.difyBaseModule
      .post('/workflows/run', {
        inputs: {
          order: hints.join('\n'),
          address: '10.10.1.86',
          token: '12b12e66-25a8-4bf0-8399-2efad65a0050',
        },
        response_mode: 'streaming',
        user: 'system',
      })
      .then((res) => {
        const last = parseJson<Record<string, any>>(
          (res.split('\n').filter(Boolean)?.pop() ?? '').split('data:')[1]?.trim() ?? ''
        );
        const data = parseJson<{ order: JournalCommand[]; missing_accounts: string[] }>(
          (last?.data?.outputs?.text ?? '').match(/```json([\s\S]*)```/)?.[1]
        );
        return data ?? { order: [], missing_accounts: [] };
      });
  }

  /** 清洗提示词 */
  async cleanHits(hints: string[]) {
    // 需要调用dify解析
    const difyHints = [];
    // 需要存入firefly
    const journals: JournalCommand[] = [];
    for (const hint of hints) {
      const preTreatment = await this.journalPretreatmentService.preTreatmentHint(hint);
      if (preTreatment) {
        journals.push(preTreatment);
        continue;
      }
      if (preTreatment === null) {
        continue;
      }
      difyHints.push(hint);
    }
    this.logger.debug(`cleanHints ${JSON.stringify({ difyHints, journals })}`);
    const { order, missing_accounts } = await this.askHintFromDify(difyHints);
    for (const item of order) {
      journals.push(item);
    }
    this.journalPretreatmentService.batchSavePretreatmentRule(difyHints, journals);
    await this.insertJournalService.insertAssetAccounts(missing_accounts);
    await this.insertJournalService.insertTransaction(journals);
    return {
      missing_accounts,
      difyHints,
      journals,
    };
  }

  @Cron('59 59 23 * * *')
  async handleCron() {
    const locked = await checkLock(this.redis, 'SingleAutomationService', 60);
    if (!locked) {
      return;
    }
    let hints = await this.popHint(this.DifyHintPopLength);
    while (Array.isArray(hints) && hints[1].length) {
      await this.cleanHits(hints[1]);
      hints = await this.popHint(this.DifyHintPopLength);
    }
  }
}
