## Context

当前后端日志通过 `winston-loki` 上报 Loki，但上报失败时缺少统一反馈，运行期通常只表现为“日志丢失”，难以及时发现和定位。相关实现分散在 `src/shared/logger.ts` 与配置层，缺少可测试的失败反馈策略与节流机制。

## Goals / Non-Goals

**Goals:**
- 在 Loki 上报失败时输出结构化反馈（本地 logger fallback），包含关键上下文字段。
- 引入反馈节流，避免连续失败导致反馈风暴。
- 保持现有日志上报主流程兼容，不改变业务日志调用方式。
- 为失败反馈和节流行为增加可重复单测。

**Non-Goals:**
- 不改造现有业务日志字段语义。
- 不新增外部告警系统依赖（如短信/IM 推送）。
- 不重写 `winston-loki` 内部实现，仅在接入层增强可观测反馈。

## Decisions

1. 在 `shared/logger.ts` 封装 LokiTransport 创建与错误反馈绑定。
- 原因：集中处理 `error` 等异常事件，避免分散到各模块。
- 备选：在调用侧 try/catch 包裹 logger 使用；被拒绝，因为无法覆盖 transport 异步失败。

2. 反馈格式采用结构化 JSON 字段（event, reason, lokiHost, retryCount, timestamp, sample）。
- 原因：便于检索与后续接入告警规则。

3. 增加基于时间窗口的反馈节流（例如 N 秒内同类错误只反馈一次）。
- 原因：Loki 持续不可用时防止日志噪音放大。

4. 通过配置开关控制反馈与节流参数。
- 原因：兼容不同环境（本地开发、测试、生产）策略差异。

## Risks / Trade-offs

- [反馈信息过多影响本地日志可读性] → 通过节流和摘要字段控制输出频率与体积。
- [节流过严导致关键错误被隐藏] → 在首次失败与窗口结束后首条失败强制输出。
- [第三方 transport 行为差异导致事件监听不稳定] → 增加单测 mock 覆盖事件触发路径。

## Migration Plan

1. 扩展 logger 配置结构，加入 feedback/sliding window 参数，保留默认值向后兼容。
2. 在 logger 初始化路径绑定 LokiTransport 异常反馈逻辑。
3. 添加单测并校验 `eslint` / `tsc`。
4. 分环境灰度开启反馈（先测试环境，再生产）。

## Open Questions

- 是否需要在反馈中附加 request trace id（若存在）以提升定位能力？
- 生产环境默认节流窗口值是否统一为 60s，或按环境分级？
