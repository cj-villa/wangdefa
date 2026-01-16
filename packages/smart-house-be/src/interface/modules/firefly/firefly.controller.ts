import { Controller, Get, Post } from '@nestjs/common';
import { Kv } from '@/infrastructure/consul';
import { FireflyBasicInfoDTO, BasicInfoService, SingleAutomationService } from '@/core/firefly';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipFormat } from '@/interface/interceptor/response-format';

@ApiTags('firefly')
@Controller('api/firefly')
export class FireflyController {
  constructor(
    private basicInfoService: BasicInfoService,
    private singleAutomationService: SingleAutomationService
  ) {}

  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  @Get('basic')
  @SkipFormat()
  @ApiOperation({ summary: '获取firefly基础信息' })
  @ApiOkResponse({
    description: '基础信息获取成功',
    type: FireflyBasicInfoDTO,
  })
  async getBasicInfo() {
    return this.basicInfoService.getBasicInfo();
  }

  @Post('runCron')
  @ApiOperation({ summary: '手动执行定时任务' })
  @ApiOkResponse({
    description: '任务开始执行',
    type: null,
  })
  async runCronManually() {
    return this.singleAutomationService.handleCron();
  }
}
