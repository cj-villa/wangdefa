import { Controller, Get, Query } from '@nestjs/common';
import { Kv, KvService } from '@/infrastructure/consul';
import axios from 'axios';

@Controller('api/firefly')
export class FireflyController {
  constructor(private consulKvService: KvService) {}

  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  @Get('account')
  async getAccount(@Query('userId') userId, @Query('type') type = 'asset') {
    return axios
      .get(`${this.domain}/api/v1/accounts`, {
        params: { type },
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res.data.data?.map((item) => item?.attributes?.name).filter(Boolean));
  }
}
