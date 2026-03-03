## Why

当前理财编辑与交易计算未显式支持手续费，导致交易净值计算偏高、收益表现不准确。手续费是交易成本的一部分，必须在录入和计算链路中统一处理。

## What Changes

- 在“编辑理财/新增理财”表单中增加“手续费”输入项，默认值为 `0`。
- 在交易净值计算逻辑中引入手续费扣减：按交易金额减去手续费后再参与净值/份额相关计算。
- 保持现有理财列表、交易列表与详情页交互不变，仅调整字段与计算结果。
- 对历史无手续费数据兼容处理（按 `0` 计算）。

## Capabilities

### New Capabilities
- `financial-transaction-fee-deduction`: 支持理财手续费录入，并在交易净值计算中扣减手续费成本。

### Modified Capabilities
- 无

## Impact

- Affected code: `packages/smart-house/src/routes/financial/tabs/financial/create-financial.tsx`、前端请求类型定义、`packages/smart-house-be/src/core/financial` 下交易计算服务与相关 DTO/Entity。
- APIs: 理财新增/更新接口 payload 增加手续费字段（默认 0）；交易计算结果将受手续费影响。
- Data: 历史记录无手续费时按 0 兼容，避免强制迁移阻断。
- Systems: 主要影响理财模块的录入与计算链路。
