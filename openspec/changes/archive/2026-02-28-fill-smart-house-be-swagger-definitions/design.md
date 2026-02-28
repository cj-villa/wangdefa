## Context

`smart-house-be` 基于 NestJS，Swagger 在 `main.ts` 已启用（非生产环境下暴露 `/docs`），但各模块 controller 的注解覆盖不一致：当前只有 `firefly`、`system/consul` 局部接口具备注解，`auth`、`financial`、`wechat`、`token` 等模块大量接口缺失接口说明、请求参数和响应定义。

这类缺失不会影响运行时功能，但会直接影响接口可发现性、联调效率和变更可追踪性。目标是在不改变业务语义的前提下完成 Swagger 定义补齐，并建立统一注解规范。

## Goals / Non-Goals

**Goals:**
- 为所有 controller 的公开接口提供完整 Swagger 定义（分组、摘要、参数、请求体、响应）。
- 统一注解风格，减少不同模块之间文档表达差异。
- 保持文档与现有 DTO/查询参数一致，避免“文档与实现不一致”。

**Non-Goals:**
- 不调整接口路径、HTTP 方法和业务逻辑。
- 不重构核心领域服务或数据模型。
- 不新增 Swagger 之外的文档系统。

## Decisions

### Decision 1: 以 controller 为最小治理单元
- Rationale: controller 是 API 暴露边界，逐文件补齐可确保无遗漏。
- Alternative considered: 仅修补高频接口。该方案快但会保留文档盲区。

### Decision 2: 优先复用现有 DTO，必要时补充专用响应 DTO
- Rationale: 复用 DTO 可降低维护成本并避免类型漂移。
- Alternative considered: 全部使用内联 schema。实现快但长期可维护性差。

### Decision 3: 建立统一注解基线
- Rationale: 统一 `@ApiTags` + `@ApiOperation` + 响应注解 + 参数注解，可保证生成文档一致。
- Alternative considered: 模块自定义风格。灵活但会造成文档碎片化。

## Risks / Trade-offs

- [Risk] 部分接口返回结构非 DTO，响应类型难以准确表达 -> Mitigation: 先以 `@ApiOkResponse` 的 description + 基础 schema 保证可读，再逐步 DTO 化。
- [Risk] 批量修改 controller 易引入导入冲突或 lint 退化 -> Mitigation: 按模块分批提交并执行 lint/test 验证。
- [Risk] 接口鉴权语义与 Swagger 声明不一致 -> Mitigation: 以 Guard/NoAuth 现状为准逐个核对。

## Migration Plan

1. 盘点 `interface/modules` 下全部 controller 与路由方法。
2. 按模块补齐 controller 级和方法级 Swagger 注解。
3. 修复编译与 lint 问题并验证 `/docs` 可正常展示。
4. 复查每个接口在文档中的分组、参数、返回值准确性。

## Open Questions

- 是否需要统一为所有受保护接口默认添加 `@ApiBearerAuth()`，并仅在 `@NoAuth` 场景例外说明？
- 对分页响应是否需要引入统一 Swagger 响应 DTO（例如 `PaginationResponse<T>`）以提升可读性？
