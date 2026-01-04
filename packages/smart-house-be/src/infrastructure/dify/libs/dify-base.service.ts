import { Inject, Injectable } from '@nestjs/common';
import { DIFY_CONFIGURATION_TOKEN } from '../constant';
import type { DifyModuleConfig } from '../dify.type';
import axios from 'axios';
import { InjectLogger, LokiLogger } from '@/interface/middleware/inject-logger';

@Injectable()
export class DifyBaseService {
  @InjectLogger(DifyBaseService.name)
  private readonly logger: LokiLogger;

  constructor(@Inject(DIFY_CONFIGURATION_TOKEN) private config: DifyModuleConfig) {}

  async get(path: string, params?: any) {
    const { host, token } = this.config;
    return axios
      .get(`${host}/v1${path}`, {
        params,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      .then((res) => res.data)
      .catch((err) => {
        this.logger.error(err.response?.data?.message);
      });
  }

  async post(path: string, data?: any) {
    const { host, token } = this.config;
    return axios
      .post(`${host}/v1${path}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        this.logger.error(err.response?.data?.message);
      });
  }
}
