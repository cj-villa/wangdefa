## Why

当前 `LokiTransport` 在日志上报失败时缺少明确反馈，导致日志链路异常只能依赖外部排查，问题发现滞后。需要在本地日志与可观测指标上给出失败反馈，确保日志系统故障可被及时感知和定位。

## What Changes

- 为 `LokiTransport` 的上报失败、重试失败、异常事件增加显式反馈机制（本地 fallback 日志/告警事件）。
- 统一失败反馈字段（错误类型、目标 Loki 地址、重试次数、最后失败时间、样本消息摘要）。
- 增加可配置策略：反馈开关、节流窗口、最大反馈频率，防止错误风暴导致二次噪声。
- 为日志上报异常路径补充单测，验证失败反馈和节流行为。

## Capabilities

### New Capabilities
- `loki-transport-error-feedback`: 在 Loki 上报异常时提供结构化反馈与节流机制，保障日志链路故障可观测。

### Modified Capabilities
- `api-interface-unit-test-coverage`: 扩展后端测试覆盖，新增 LokiTransport 异常路径和反馈行为校验。

## Impact

- Affected code:
  - `packages/smart-house-be/src/shared/logger.ts`
  - `packages/smart-house-be/src/infrastructure/config/env.config.ts`
  - `packages/smart-house-be/test/**`（新增或扩展 logger 相关测试）
- APIs: 无外部接口变更。
- Dependencies: 预期不新增运行时依赖。
- Systems: 提升日志链路故障的可观测性与运维响应效率。
