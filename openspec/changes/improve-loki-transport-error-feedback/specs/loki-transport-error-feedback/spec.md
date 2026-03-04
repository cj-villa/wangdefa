## ADDED Requirements

### Requirement: Loki 上报失败 MUST 产生结构化反馈
系统在 `LokiTransport` 发生上报异常时 MUST 输出结构化反馈日志，包含错误类型、目标 Loki 信息和发生时间等关键字段，以便快速定位日志链路异常。

#### Scenario: 发生单次上报失败
- **WHEN** LokiTransport 在发送日志时触发异常事件
- **THEN** 系统 MUST 记录一条结构化失败反馈日志
- **AND** 反馈中 MUST 包含 `event`, `reason`, `lokiHost`, `timestamp` 字段

### Requirement: 失败反馈 MUST 支持节流控制
系统 MUST 对连续同类 Loki 上报失败应用节流策略，避免短时间内重复反馈导致日志噪声。

#### Scenario: 连续失败触发节流
- **WHEN** 在配置的节流窗口内发生多次同类上报失败
- **THEN** 系统 MUST 至少保留首条反馈
- **AND** 后续反馈 MUST 按节流策略抑制或聚合

### Requirement: 反馈策略 MUST 可配置且默认向后兼容
系统 MUST 支持通过配置控制失败反馈开关和节流参数，且默认行为不得破坏现有日志主流程。

#### Scenario: 未显式配置反馈参数
- **WHEN** 运行环境未提供 Loki 反馈相关配置
- **THEN** 系统 MUST 使用内置默认值完成初始化
- **AND** 业务日志写入主流程保持可用
