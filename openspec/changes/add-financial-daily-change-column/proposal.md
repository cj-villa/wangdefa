## Why

理财净值列表当前缺少“日涨幅”信息，用户无法快速判断基金当日表现和涨跌方向，导致查看效率和决策直观性不足。该信息是理财列表的核心决策维度，需要尽快补齐并统一视觉语义。

## What Changes

- 在理财列表的“查看净值列表”中新增“日涨幅”列。
- 日涨幅按百分比展示，支持正负值显示。
- 涨幅为正时使用红色视觉样式，跌幅为负时使用绿色视觉样式，零值使用中性样式。
- 保持现有列表筛选、排序、分页行为不变，避免影响其他业务流程。

## Capabilities

### New Capabilities
- `financial-net-value-daily-change-visualization`: 在理财净值列表中提供日涨幅数据列与涨跌颜色语义展示。

### Modified Capabilities
- 无

## Impact

- Affected code: `packages/smart-house/src/routes/financial/tabs/financial/net-value-table.tsx` 以及相关列定义/样式工具。
- APIs: 如日涨幅字段已存在则直接消费；若字段命名不一致，需做前端字段映射兼容。
- Dependencies: 无新增第三方依赖，沿用现有 antd/antd pro 组件能力。
- Systems: 仅影响前端理财模块列表展示层。
