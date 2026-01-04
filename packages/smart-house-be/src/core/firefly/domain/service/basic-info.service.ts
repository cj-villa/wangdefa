import { Injectable } from '@nestjs/common';
import { Kv } from '@/infrastructure/consul';
import axios from 'axios';
import { AccountType } from '@/core/firefly';
import type { FireflyAccount, FireflyBudget, FireflyCategory, FireflyTag } from '@/core/firefly';

@Injectable()
export class BasicInfoService {
  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  private async get<D extends any = any>(path: string, params: any = {}) {
    return axios
      .get<any, { data: { data: Array<{ type: string; id: number; attributes: D }>; meta: any } }>(
        `${this.domain}${path}`,
        {
          params: { limit: 10, ...params },
          headers: {
            Authorization: `Bearer ${this.token}`,
            accept: 'application/vnd.api+json',
          },
        }
      )
      .then((res) => res.data);
  }

  private async getByRecursion<D extends any = any>(path: string, params: any = {}) {
    let hasMore = true;
    let current = 1;
    const list: Array<{ type: string; id: number; attributes: D }> = [];
    while (hasMore) {
      const res = await this.get<D>(path, { ...params, current: current });
      current += res.data?.length ?? 0;
      list.push(...res.data);
      hasMore = res.meta?.pagination?.total && list.length < res.meta.pagination.total;
    }
    return list;
  }

  async getAccounts(type: AccountType) {
    return this.getByRecursion<FireflyAccount>('/api/v1/accounts', { type });
  }

  async getBudgets() {
    return this.getByRecursion<FireflyBudget>('/api/v1/budgets');
  }

  async getTags() {
    return this.getByRecursion<FireflyTag>('/api/v1/tags');
  }

  async getCategories() {
    return this.getByRecursion<FireflyCategory>('/api/v1/categories');
  }

  async getBasicInfo() {
    const [assetAccounts, expenseAccounts, budgets, tags, categories] = await Promise.all([
      this.getAccounts(AccountType.Asset),
      this.getAccounts(AccountType.Expense),
      this.getBudgets(),
      this.getTags(),
      this.getCategories(),
    ]);
    return { assetAccounts, expenseAccounts, budgets, tags, categories };
  }
}
