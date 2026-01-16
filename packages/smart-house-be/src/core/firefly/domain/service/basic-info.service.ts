import { Injectable } from '@nestjs/common';
import { Kv } from '@/infrastructure/consul';
import axios from 'axios';
import { AccountType } from '@/core/firefly';
import type { FireflyAccount, FireflyBudget, FireflyCategory, FireflyTag } from '@/core/firefly';

type FireflyData<Item = any> = {
  data: Array<{ type: string; id: number; attributes: Item }>;
  meta: any;
};

type FireflyList<Item = any> = Array<{ type: string; id: number; attributes: Item }>;

@Injectable()
export class BasicInfoService {
  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  private async get<D extends any = any>(path: string, params: any = {}): Promise<FireflyData<D>> {
    return axios
      .get<any, { data: FireflyData<D> }>(`${this.domain}${path}`, {
        params: { limit: 10, ...params },
        headers: {
          Authorization: `Bearer ${this.token}`,
          accept: 'application/vnd.api+json',
        },
      })
      .then((res) => res.data);
  }

  private async getByRecursion<D extends any = any>(path: string, params: any = {}) {
    let hasMore = true;
    let current = 1;
    const list: FireflyList<D> = [];
    while (hasMore) {
      const res = await this.get<D>(path, { ...params, current: current });
      current += res.data?.length ?? 0;
      list.push(...res.data);
      hasMore = res.meta?.pagination?.total && list.length < res.meta.pagination.total;
    }
    return list;
  }

  getAccounts(type: AccountType, recursion?: true): Promise<FireflyList<FireflyAccount>>;
  getAccounts(type: AccountType, recursion: false): Promise<FireflyData<FireflyAccount>>;
  async getAccounts(type: AccountType, recursion?: boolean) {
    return recursion
      ? this.getByRecursion<FireflyAccount>('/api/v1/accounts', { type })
      : this.get<FireflyAccount>('/api/v1/accounts', { type });
  }

  getBudgets(recursion?: true): Promise<FireflyList<FireflyBudget>>;
  getBudgets(recursion: false): Promise<FireflyData<FireflyBudget>>;
  async getBudgets(recursion?: boolean) {
    return recursion
      ? this.getByRecursion<FireflyBudget>('/api/v1/budgets')
      : this.get<FireflyBudget>('/api/v1/budgets');
  }

  getTags(recursion?: true): Promise<FireflyList<FireflyTag>>;
  getTags(recursion: false): Promise<FireflyData<FireflyTag>>;
  async getTags(recursion?: boolean) {
    return recursion
      ? this.getByRecursion<FireflyTag>('/api/v1/tags')
      : this.get<FireflyTag>('/api/v1/tags');
  }

  getCategories(recursion?: true): Promise<FireflyList<FireflyCategory>>;
  getCategories(recursion: false): Promise<FireflyData<FireflyCategory>>;
  async getCategories(recursion?: boolean) {
    return recursion
      ? this.getByRecursion<FireflyCategory>('/api/v1/categories')
      : this.get<FireflyCategory>('/api/v1/categories');
  }

  async getBasicInfo() {
    const [assetAccounts, expenseAccounts, budgets, tags, categories] = await Promise.all([
      this.getAccounts(AccountType.Asset, true).then((list) =>
        list.map((item) => item.attributes.name)
      ),
      this.getAccounts(AccountType.Expense, true).then((list) =>
        list.map((item) => item.attributes.name)
      ),
      this.getBudgets(true).then((list) => list.map((item) => item.attributes.name)),
      this.getTags(true).then((list) => list.map((item) => item.attributes.tag)),
      this.getCategories(true).then((list) => list.map((item) => item.attributes.name)),
    ]);
    return { assetAccounts, expenseAccounts, budgets, tags, categories };
  }
}
