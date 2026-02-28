## Why

当前 `smart-house-be` 的 Swagger 注解覆盖不完整，只有少量 controller/接口包含 `@ApiOperation`、`@ApiOkResponse` 等定义，导致接口文档不一致、前后端联调与测试定位成本较高。现在补齐可直接提升接口可发现性和维护效率，并为后续 API 变更提供统一约束。

## What Changes

- 为 `packages/smart-house-be/src/interface/modules` 下所有 controller 的公开接口补齐 Swagger 注解。
- 在 controller 级别统一补充 `@ApiTags`，按模块维度划分文档分组。
- 在接口级别补充 `@ApiOperation`、`@ApiOkResponse`/`@ApiResponse`，并按实际情况补充 `@ApiBody`、`@ApiQuery`、`@ApiParam`。
- 对需要鉴权的接口补充鉴权相关 Swagger 声明（如 `@ApiBearerAuth`），并明确无需鉴权的接口文档语义。
- 对返回值为分页、空响应或包装结构的接口，统一定义可读且一致的响应描述。

## Capabilities

### New Capabilities
- `smart-house-be-swagger-coverage`: 为后端所有接口提供完整、统一、可维护的 Swagger 文档定义。

### Modified Capabilities
- None.

## Impact

- Affected code: `packages/smart-house-be/src/interface/modules/**/*controller.ts`
- Affected docs/runtime behavior: Swagger 文档完整性与可读性提升，不改变业务功能语义
- Dependencies: 继续使用现有 `@nestjs/swagger`，无新增第三方依赖
