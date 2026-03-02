## Why

当前后端接口的单元测试覆盖不完整，导致接口参数校验、异常返回和核心业务分支缺少稳定回归保护。随着接口持续迭代，缺乏测试基线会显著增加回归风险和线上问题定位成本。

## What Changes

- 为 `packages/smart-house-be/src/interface/modules/**` 下的接口控制器补齐单元测试，覆盖成功、参数错误、依赖服务抛错等主路径与异常路径。
- 为关键 DTO 校验与转换行为补齐测试，确保请求入参在 `class-validator/class-transformer` 层行为可验证。
- 补充通用测试夹具（mock 工具、构造器）以降低重复样板代码，统一接口测试写法。
- 将接口测试纳入本地与 CI 执行清单，确保 `eslint`、`tsc` 与新增测试可持续通过。

## Capabilities

### New Capabilities
- `api-interface-unit-test-coverage`: 为后端接口层建立可执行、可维护的单测覆盖基线，并明确最小覆盖要求与失败门禁。

### Modified Capabilities
- None.

## Impact

- Affected code: `packages/smart-house-be/src/interface/modules/**`, `packages/smart-house-be/test/**`。
- APIs: 不新增接口，不变更接口协议；仅增强测试保障。
- Dependencies: 复用现有 `jest`、`@nestjs/testing` 能力，不引入新运行时依赖。
