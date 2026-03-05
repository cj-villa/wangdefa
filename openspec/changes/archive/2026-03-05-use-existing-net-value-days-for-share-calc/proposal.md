## Why

当前份额计算按“向前 N 个自然日”取净值，遇到节假日或缺失净值时会命中空数据或偏差数据，导致申购/赎回份额不准确。需要改为按“向前存在净值的 N 天”取值，保证计算结果稳定且贴近真实交易口径。

## What Changes

- 调整份额计算时净值选择逻辑：从“自然日回溯”改为“仅在存在净值记录的日期中回溯 N 天”。
- 为净值选择增加缺失数据处理规则，避免因连续缺失导致计算失败。
- 保持现有交易入参、接口结构不变，仅修改内部净值命中策略。
- 为新策略补充单元测试覆盖（连续缺失、正常命中、边界天数）。

## Capabilities

### New Capabilities
- `financial-share-net-value-reference`: 定义份额计算时净值回溯应基于“存在净值的交易日序列”而非自然日序列。

### Modified Capabilities
- `financial-transaction-fee-deduction`: 更新交易份额计算的净值命中规则，确保手续费扣减后份额计算使用新的“有效净值日”策略。

## Impact

- Affected code:
  - `packages/smart-house-be/src/core/financial/domain/service/track-financial-transaction.service.ts`
  - `packages/smart-house-be/src/core/financial/domain/service/financial-net-value.serivce.ts`
  - `packages/smart-house-be/test/**`（份额计算相关单测）
- APIs: 无外部接口字段变化。
- Dependencies: 无新增运行时依赖。
- Systems: 提升交易份额计算准确性，减少因净值缺失导致的异常与人工修正。
