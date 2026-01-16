import { Inject, Injectable } from '@nestjs/common';
import { type ConsulKvModuleConfig } from '@/infrastructure/consul/consul.type';
import { CONSUL_CONFIGURATION_TOKEN } from '@/infrastructure/consul/constant';
import axios from 'axios';

@Injectable()
export class ConsulBaseService {
  constructor(@Inject(CONSUL_CONFIGURATION_TOKEN) private config: ConsulKvModuleConfig) {}

  async get(path: string, params?: any) {
    const { host, token } = this.config;
    return axios
      .get(`${host}${path}`, {
        params,
        headers: { 'X-Consul-Token': token },
      })
      .then((res) => res.data);
  }

  async post(path: string, data?: any) {
    const { host, token } = this.config;
    return axios.post(`${host}${path}`, data, { headers: { 'X-Consul-Token': token } });
  }
}
