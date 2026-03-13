## Why

当前理财列表页默认展示了过多概览指标和列表金额字段，首屏信息密度偏高，用户进入页面时难以快速聚焦“昨日收益”这一最常用指标。需要统一默认显示策略，降低噪音，同时保留用户按需展开其他指标和金额列的能力。

## What Changes

- 调整理财列表 dashboard 的默认可见项，仅默认展示“昨日收益”，其余概览指标默认隐藏。
- 调整理财列表中“总金额”相关列的默认显示状态，首屏默认隐藏。
- 保持用户主动打开隐藏指标和列的交互能力，不改变数据来源和接口协议。

## Capabilities

### New Capabilities
- `financial-dashboard-default-visibility`: 定义理财列表页 dashboard 指标卡片和金额列的默认显示规则。

### Modified Capabilities

## Impact

- 影响前端理财列表页的 dashboard 展示层和表格列配置。
- 不涉及后端接口、数据结构或外部依赖变更。
- 需要在实现阶段校验 `eslint` 和 `tsc`，避免默认显示配置引入回归。
