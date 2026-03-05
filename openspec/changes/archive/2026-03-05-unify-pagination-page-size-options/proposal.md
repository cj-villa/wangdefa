## Why

当前各分页页面的每页条数选项不统一，用户在不同列表间切换时体验不一致，且难以快速定位合适的数据密度。统一支持 `10/20/50` 可降低学习成本并提升列表浏览效率。

## What Changes

- 统一分页组件可选页大小为 `10`、`20`、`50`。
- 清理各页面/模块中不一致的分页默认值与可选项配置。
- 保持现有分页参数结构（`current`、`pageSize`）不变，避免接口兼容风险。
- 补充关键分页页面的回归测试，确保分页切换与数据请求行为正确。

## Capabilities

### New Capabilities
- `pagination-page-size-options`: 规范系统分页可选项统一为 `10/20/50`，并要求页面行为一致。

### Modified Capabilities
- 无

## Impact

- Affected code:
  - `packages/smart-house/src/**`（列表分页组件、页面级分页配置）
  - 可能涉及 `packages/smart-house-be/src/**` 中分页默认值对齐（如存在硬编码）
  - `packages/smart-house*/test/**`（分页行为相关测试）
- APIs: 不新增接口字段，不改动分页参数名称。
- Dependencies: 无新增运行时依赖。
- Systems: 前后端分页配置一致性与可维护性提升。
