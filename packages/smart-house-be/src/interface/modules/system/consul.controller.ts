import { Controller, Get, Post, Query, Body, UseInterceptors, Inject } from '@nestjs/common';
import { KvService } from '@/infrastructure/consul';
import { SystemConfigUpdateDto } from '@/core/system/interface/dto/system-config-update.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PaginationFormatInterceptor } from '@/interface/interceptor/response-format';
import { consulConfig } from '@/infrastructure/config';
import { type ConfigType } from '@nestjs/config';

@Controller('/api/system/config')
export class SystemConfigController {
  constructor(private readonly kvService: KvService) {}

  @Inject(consulConfig.KEY)
  private readonly consulConfig: ConfigType<typeof consulConfig>;

  @Get('/list')
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
  async detail(@Query('key') key: string) {
    return this.kvService.get(key);
  }

  @ApiOperation({ summary: '更新系统配置' })
  @ApiOkResponse({
    description: '系统配置更新成功',
    type: SystemConfigUpdateDto,
  })
  @Post('/update')
  async update(@Body() body: SystemConfigUpdateDto) {
    return this.kvService.update(body.key, body.data);
  }
}
