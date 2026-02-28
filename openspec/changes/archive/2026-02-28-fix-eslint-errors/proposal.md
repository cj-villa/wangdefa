## Why

当前代码库存在较多 ESLint 报错，影响持续集成稳定性与代码可维护性，也阻塞后续功能迭代的提交效率。需要集中治理并建立可持续的 lint 通过基线，确保后续改动可持续通过质量校验。

## What Changes

- 统一梳理并修复仓库现有 ESLint 报错（优先可自动修复项，再处理规则级错误）。
- 在不改变业务行为的前提下，调整代码结构与写法以满足现有 ESLint 规则。
- 对复杂/重复问题形成一致修复模式（如 import 顺序、hooks 依赖、类型约束、未使用变量等）。
- 校验关键子项目 lint 全量通过，并记录修复边界与风险点。

## Capabilities

### New Capabilities
- `eslint-compliance-baseline`: 建立并维持仓库 ESLint 零报错的质量基线及统一修复规范。

### Modified Capabilities
- None.

## Impact

- Affected code: `packages/smart-house/**`, `packages/smart-house-be/**`（以及其他存在 lint 报错的工作区）。
- APIs: 无新增对外 API；仅代码质量与结构优化。
- Tooling: ESLint 配置、lint 执行脚本与相关开发流程将被验证。
- Delivery: 提升 CI 稳定性，减少后续提交的 lint 回归成本。
