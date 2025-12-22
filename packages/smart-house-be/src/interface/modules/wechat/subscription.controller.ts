import { All, Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { Public } from 'src/interface/guard';
import {
  SubscriptionDecryptionService,
  type SubscriptionDecryptionRequestBodyDto,
  type SubscriptionDecryptionRequestQueryDto,
  SubscriptionDecryptionCommand,
  SubscriptionPayloadCommand,
} from '@/core/wechat';
import { Kv } from '@/infrastructure/consul';

@Controller('/api/open/wechat')
export class SubscriptionController {
  // @Inject(REDIS_INSTANCE)
  // private readonly redis: RedisClientType;

  @Kv('token', ['subscription', 'token'])
  private readonly token: string;

  @Kv('token', ['subscription', 'encodingAESKey'])
  private readonly encodingAESKey: string;

  @Inject(SubscriptionDecryptionService)
  private readonly decryptionService: SubscriptionDecryptionService;

  // @Inject(CACHE_MANAGER)
  // private cacheManager: Cache;

  @Public()
  @Get('')
  verify(
    @Body() body: SubscriptionDecryptionRequestBodyDto,
    @Query() query: SubscriptionDecryptionRequestQueryDto
  ) {
    const result = this.decryptionService.decrypt(
      SubscriptionDecryptionCommand.fromDto(body, query, this.token, this.encodingAESKey),
      SubscriptionPayloadCommand.fromDto(body)
    );
    return result ? query.echostr : false;
  }

  @Public()
  @Post('')
  onMessage(
    @Body() body: SubscriptionDecryptionRequestBodyDto,
    @Query() query: SubscriptionDecryptionRequestQueryDto
  ) {
    const result = this.decryptionService.decrypt(
      SubscriptionDecryptionCommand.fromDto(body, query, this.token, this.encodingAESKey),
      SubscriptionPayloadCommand.fromDto(body)
    );
    if (result) {
      console.log(
        this.decryptionService.getPayload(
          SubscriptionDecryptionCommand.fromDto(body, query, this.token, this.encodingAESKey),
          SubscriptionPayloadCommand.fromDto(body)
        )
      );
    }
    return result ? query.echostr : false;
  }

  @Public()
  @All('test')
  async test(@Query() query: any) {
    return 'test';
  }
}
