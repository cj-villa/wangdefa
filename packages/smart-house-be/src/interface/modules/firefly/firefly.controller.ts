import { Controller, Get } from '@nestjs/common';
import { Kv } from '@/infrastructure/consul';
import { BasicInfoService } from '@/core/firefly';

@Controller('api/firefly')
export class FireflyController {
  constructor(private basicInfoService: BasicInfoService) {}

  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  @Get('basic')
  async getBasicInfo() {
    return this.basicInfoService.getBasicInfo();
  }
}
