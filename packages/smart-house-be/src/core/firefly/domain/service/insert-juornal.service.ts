import { Injectable } from '@nestjs/common';
import { Kv } from '@/infrastructure/consul';
import axios from 'axios';
import { type AccountCommand } from '@/core/firefly/application/commands/account-command';
import { FireflyAccount, JournalCommand } from '@/core/firefly';
import { type TransactionBatchCommand } from '@/core/firefly/application/commands/transaction-command';
import { FireflyTransaction } from '@/core/firefly/application/query/transaction';
import { TransactionType } from '@/core/firefly/application/enum/transaction-type';
import { InjectLogger, type LokiLogger } from '@/interface/decorate/inject-logger';

type FireflyData<Item = any> = {
  type: string;
  id: number;
  attributes: Item;
};

@Injectable()
export class InsertJournalService {
  @InjectLogger(InsertJournalService.name)
  private readonly logger: LokiLogger;

  @Kv('token', 'firefly')
  token: string;

  @Kv('domain', 'firefly')
  domain: string;

  private async post<D extends any = any, T = any>(
    path: string,
    params: any = {}
  ): Promise<FireflyData<D>> {
    return axios
      .post<T, { data: FireflyData<D> }>(`${this.domain}${path}`, {
        params: { limit: 10, ...params },
        headers: {
          Authorization: `Bearer ${this.token}`,
          accept: 'application/vnd.api+json',
        },
      })
      .then((res) => res.data);
  }

  async insertAssetAccounts(names: string[]) {
    return Promise.all(
      names.map((name) => {
        return this.post<FireflyAccount, AccountCommand>('/api/v1/accounts', {
          name,
          type: 'asset',
          account_role: 'defaultAsset',
        }).catch((error) => {
          this.logger.error(error);
        });
      })
    );
  }

  async insertTransaction(journals: JournalCommand[]) {
    return this.post<
      {
        created_at: string;
        updated_at: string;
        user: string;
        user_group: string;
        group_title: string;
        transactions: FireflyTransaction[];
      },
      TransactionBatchCommand
    >('/api/v1/transactions', {
      error_if_duplicate_hash: false,
      apply_rules: false,
      fire_webhooks: true,
      transactions: journals.map((item) => ({
        type: {
          expense: TransactionType.Withdrawal,
          income: TransactionType.Deposit,
          transfer: TransactionType.Transfer,
        }[item.type],
        date: item.time,
        amount: item.amount,
        description: item.description,
        budget_name: item.budget,
        internal_reference: item.tradeNo,
        category_name: item.category,
        source_name: item.source,
        destination_name: item.target,
        tags: item.tag && [item.tag],
        notes: item.hint,
      })),
    });
  }
}
