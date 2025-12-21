import {Body, Controller, Get, Inject, Post, Query} from '@nestjs/common';
import {REDIS_INSTANCE} from '@/infrastructure/redis';
import Redis from 'ioredis';
import {Public} from 'src/interface/guard';
import {
    SubscriptionDecryptionService,
    type SubscriptionDecryptionRequestBodyDto,
    type SubscriptionDecryptionRequestQueryDto,
    SubscriptionDecryptionCommand,
    SubscriptionPayloadCommand,
} from '@/core/wechat';
import {Kv} from '@/infrastructure/consul';

@Controller('/api/open/wechat')
export class SubscriptionController {
    @Inject(REDIS_INSTANCE)
    private readonly redis: Redis;

    @Kv('token', ['subscription', 'token'])
    private readonly token: string;

    @Kv('token', ['subscription', 'encodingAESKey'])
    private readonly encodingAESKey: string;

    @Inject(SubscriptionDecryptionService)
    private readonly decryptionService: SubscriptionDecryptionService;

    @Public()
    @Get('')
    check(
        @Body() body: SubscriptionDecryptionRequestBodyDto,
        @Query() query: SubscriptionDecryptionRequestQueryDto
    ) {
        return this.decryptionService.decrypt(
            SubscriptionDecryptionCommand.fromDto(body, query, this.token, this.encodingAESKey),
            SubscriptionPayloadCommand.fromDto(body)
        );
    }

    @Public()
    @Get('test')
    test() {
        return 'public';
    }

    @Public()
    @Post('/auth')
    auth(@Body() body) {
        const now = new Date();
        const key = `firefly.task.${now.getDay()}`;
        return this.redis.lpush(key, JSON.stringify(body));
    }
}
