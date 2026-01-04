import { MAIL_CONFIGURATION_LOADER, MAIL_INSTANCE } from '../constant';
import { MailModuleConfig } from '../mail.type';
import { Imap } from '@/infrastructure/mail/libs/Imap';
import { REDIS_INSTANCE } from '@/infrastructure/redis';
import { type RedisClientType } from 'redis';
import { createLogger } from '@/shared/logger';
import { checkLock } from '@/shared/lock';

const logger = createLogger('MailModule');

export const createInstance = () => ({
  provide: MAIL_INSTANCE,
  useFactory: async (config: MailModuleConfig, redis: RedisClientType) => {
    const locked = await checkLock(redis, 'mail', 60);
    logger.info(`Seize mail instance: ${locked}`);
    if (!locked) {
      return;
    }
    return new Imap({
      ...config,
      logger: false,
    });
  },
  inject: [MAIL_CONFIGURATION_LOADER, REDIS_INSTANCE],
});
