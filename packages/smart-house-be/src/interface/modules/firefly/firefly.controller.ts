import { Controller, Get } from '@nestjs/common';
import { Kv } from '@/infrastructure/consul';
import { FireflyBasicInfoDTO, BasicInfoService } from '@/core/firefly';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('firefly')
@Controller('api/firefly')
export class FireflyController {
  constructor(private basicInfoService: BasicInfoService) {}

  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  @Get('basic')
  @ApiOperation({ summary: '获取firefly基础信息' })
  @ApiOkResponse({
    description: '基础信息获取成功',
    type: FireflyBasicInfoDTO,
  })
  async getBasicInfo() {
    return this.basicInfoService.getBasicInfo();
  }
}
