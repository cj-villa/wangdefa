## Why

新增理财交易时前后端字段类型不一致，导致接口返回 `amount must be a number string`、`transactionDate must be a Date instance`、`ensureDate must be a Date instance`。该问题直接阻塞交易创建，必须尽快修复以恢复核心业务流程。

## What Changes

- 统一新增交易请求在前端提交时的字段格式：`amount` 使用后端期望的 number string，日期字段使用可被后端 DTO 正确转换的日期值。
- 校准后端交易创建 DTO 的校验与转换链路，确保日期与金额类型校验与实际请求格式一致。
- 补充交易创建链路的最小回归校验，覆盖金额与日期字段的正确/错误输入。

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `financial-filter-alignment-and-ux`: 调整“交易创建”接口契约实现，确保前端提交值与后端校验规则一致并可成功创建交易。

## Impact

- Affected code: `packages/smart-house/src/routes/financial/**`, `packages/smart-house/src/request/**`, `packages/smart-house-be/src/core/financial/**`, `packages/smart-house-be/src/interface/modules/financial/**`。
- APIs: 不新增接口，修复既有交易创建接口参数兼容性与校验行为。
- Testing: 需要验证新增交易表单提交流程与后端 DTO 校验结果。
