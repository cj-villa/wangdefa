import { Controller, Get, Post, Query, Body, UseInterceptors, Inject } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SystemConfigUpdateDto } from '@/core/system/interface/dto/system-config-update.dto';
import { consulConfig } from '@/infrastructure/config';
import { KvService } from '@/infrastructure/consul';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';

@ApiTags('system-config')
@ApiBearerAuth()
@Controller('/api/system/config')
export class SystemConfigController {
  constructor(private readonly kvService: KvService) {}

  @Inject(consulConfig.KEY)
  private readonly consulConfig: ConfigType<typeof consulConfig>;

  @Get('/list')
  @ApiOperation({ summary: '获取系统配置 key 列表' })
  @ApiOkResponse({
    description: '系统配置 key 列表查询成功',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'string' } },
        total: { type: 'number' },
        success: { type: 'boolean' },
      },
    },
  })
  @UseInterceptors(PaginationFormatInterceptor)
  async getConfigList() {
    const list = await this.kvService
      .list()
      .then((list) =>
        list
          .map((i) =>
            !this.consulConfig.prefix
              ? i
              : i.replace(new RegExp(`^${this.consulConfig.prefix}/`), '')
          )
          .filter((i) => Boolean(i) && !i.endsWith('/'))
      );
    return [list, list.length];
  }

  @Get('/detail')
  @ApiOperation({ summary: '查询单个系统配置详情' })
  @ApiQuery({ name: 'key', description: '配置 key', required: true, type: String })
  @ApiOkResponse({
    description: '系统配置详情查询成功',
    schema: { type: 'object', additionalProperties: true },
  })
  async detail(@Query('key') key: string) {
    return this.kvService.get(key);
  }

  @ApiBody({ type: SystemConfigUpdateDto })
  @ApiOperation({ summary: '更新系统配置' })
  @ApiOkResponse({
    description: '系统配置更新成功',
    schema: { type: 'object', additionalProperties: true },
  })
  @Post('/update')
  async update(@Body() body: SystemConfigUpdateDto) {
    return this.kvService.update(body.key, body.data);
  }
}
