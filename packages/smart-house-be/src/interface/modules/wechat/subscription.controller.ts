import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { NoAuth, Public } from 'src/interface/guard';
import {
  type SubscriptionDecryptionRequestQueryDto,
  DecryptQuery,
  DecryptBody,
  SubscriptionService,
} from '@/core/wechat';
import { SkipFormat } from '@/interface/interceptor/response-format';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('wechat-open')
@Controller('/api/open/wechat')
export class SubscriptionController {
  @Inject() private readonly subscriptionService: SubscriptionService;

  @Public()
  @NoAuth()
  @SkipFormat()
  @Get('')
  @ApiOperation({ summary: '微信公众号 URL 验证' })
  @ApiQuery({ name: 'timestamp', required: true, type: String, description: '时间戳' })
  @ApiQuery({ name: 'nonce', required: true, type: String, description: '随机串' })
  @ApiQuery({ name: 'echostr', required: true, type: String, description: '回显字符串' })
  @ApiQuery({ name: 'msg_signature', required: true, type: String, description: '消息签名' })
  @ApiQuery({ name: 'encrypt_type', required: false, type: String, description: '加密类型' })
  @ApiOkResponse({ description: '校验通过后返回 echostr', schema: { type: 'string' } })
  verify(@DecryptQuery() query: SubscriptionDecryptionRequestQueryDto) {
    return query.echostr;
  }

  @Public()
  @NoAuth()
  @SkipFormat()
  @Post('')
  @ApiOperation({ summary: '接收微信公众号回调消息' })
  @ApiBody({
    description: '微信服务器回调 XML 解析后的消息体',
    schema: { type: 'object', additionalProperties: true },
  })
  @ApiOkResponse({ description: '回调处理成功', schema: { type: 'object', additionalProperties: true } })
  onMessage(@DecryptBody() body) {
    return this.subscriptionService.onMessage(body);
  }

  @Public()
  @NoAuth()
  @Get('test')
  @ApiOperation({ summary: '微信回调联调测试接口' })
  @ApiQuery({ name: 'query', required: false, type: String, description: '透传测试参数' })
  @ApiOkResponse({ description: '测试查询成功', schema: { type: 'object', additionalProperties: true } })
  async test(@Query() query: unknown) {
    return { query };
  }
}
