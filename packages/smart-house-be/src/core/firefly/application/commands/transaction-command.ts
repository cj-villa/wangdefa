import { TransactionType } from '@/core/firefly/application/enum/transaction-type';

export class TransactionCommand {
  type: TransactionType;
  date: string;
  amount: string;
  description: string;
  budget_name: string;
  category_name: string;
  source_name: string;
  destination_name: string;
  internal_reference?: string;
  tags: string[];
  notes: string;
}

export class TransactionBatchCommand {
  // 账单已存在时抛错
  error_if_duplicate_hash?: boolean;
  // 创建时是否执行自动规则
  apply_rules?: boolean;
  // 创建时是否执行webhook
  fire_webhooks?: boolean;
  // Title of the transaction if it has been split in more than one piece. Empty otherwise
  group_title?: string;
  transactions: TransactionCommand[];
}
