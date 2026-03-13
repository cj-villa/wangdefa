export const FINANCIAL_DASHBOARD_DEFAULT_VISIBLE_KEYS = ['preDayProfit'] as const;

export const FINANCIAL_MASKED_DASHBOARD_KEYS = ['totalAssets', 'totalFee', 'totalProfit'] as const;

export const FINANCIAL_MASKED_COLUMN_KEYS = ['balance'] as const;

export const HIDDEN_VALUE_PLACEHOLDER = '**';

export const isMaskedFinancialValue = (
  key: string,
  maskedKeys: readonly string[],
  showActualValue: boolean
) => !showActualValue && maskedKeys.includes(key);
