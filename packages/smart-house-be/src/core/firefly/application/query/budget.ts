import { AutoBudgetType } from '../enum/auto-budget-type';
import { AutoBudgetPeriod } from '../enum/auto-budget-period';

export class FireflyBudget {
  // 基本信息
  name: string;
  active: boolean;
  notes?: string;

  // 金额（可能为空，取决于是否设置限额）
  auto_budget_type?: AutoBudgetType;
  auto_budget_amount?: string;
  auto_budget_period?: AutoBudgetPeriod;

  // 统计
  spent?: string;

  // 系统字段
  created_at: string;
  updated_at: string;
}
