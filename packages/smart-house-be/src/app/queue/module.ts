/** 消息队列 */
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const bullModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const redisConfig = configService.get('redis');
    return {
      redis: redisConfig,
    };
  },
  inject: [ConfigService],
});
