import { Inject, Injectable } from '@nestjs/common';
import { type ConsulKvModuleConfig } from '@/infrastructure/consul/consul.type';
import { CONSUL_CONFIGURATION_TOKEN } from '@/infrastructure/consul/constant';
import { http } from '@/shared/request';

@Injectable()
export class ConsulBaseService {
  constructor(@Inject(CONSUL_CONFIGURATION_TOKEN) private config: ConsulKvModuleConfig) {}

  async get(path: string, params?: any) {
    const { host, token } = this.config;
    return http.get(`${host}${path}`, {
      params,
      headers: { 'X-Consul-Token': token },
    });
  }

  async post(path: string, data?: any) {
    const { host, token } = this.config;
    return http.post(`${host}${path}`, data, { headers: { 'X-Consul-Token': token } });
  }
}
