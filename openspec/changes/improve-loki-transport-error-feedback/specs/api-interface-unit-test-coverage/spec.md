## ADDED Requirements

### Requirement: Logger transport 异常路径 MUST 有单元测试覆盖
后端测试集合 MUST 覆盖 LokiTransport 上报失败时的反馈与节流行为，确保日志可观测保障逻辑在重构后不会回归。

#### Scenario: 失败反馈被触发
- **WHEN** 单元测试模拟 LokiTransport 异常事件
- **THEN** 测试 MUST 断言结构化反馈被记录

#### Scenario: 节流策略生效
- **WHEN** 单元测试在节流窗口内模拟多次同类异常
- **THEN** 测试 MUST 断言反馈数量符合节流预期
