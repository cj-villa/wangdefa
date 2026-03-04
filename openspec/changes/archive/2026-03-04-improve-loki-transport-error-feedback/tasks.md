## 1. LokiTransport 异常反馈设计落地

- [x] 1.1 在 `shared/logger` 中抽离 LokiTransport 初始化与异常事件绑定逻辑
- [x] 1.2 实现结构化失败反馈字段（event/reason/lokiHost/retryCount/timestamp/sample）
- [x] 1.3 增加反馈开关与默认兼容配置，保证未配置时行为稳定

## 2. 反馈节流与噪音控制

- [x] 2.1 实现同类错误的时间窗口节流策略
- [x] 2.2 保证首条失败可见，并对窗口内重复失败进行抑制或聚合
- [x] 2.3 在配置层暴露节流参数（窗口、最大反馈频率）

## 3. 测试与质量校验

- [x] 3.1 增加单测覆盖 LokiTransport 失败反馈触发路径
- [x] 3.2 增加单测覆盖节流策略生效路径
- [x] 3.3 执行并通过 `eslint` 与 `tsc` 校验
