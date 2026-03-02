## Why

当前理财详情的“余额趋势”只展示余额变化，无法直观看到同周期收益变化，用户在分析资产波动原因时需要在多个区域来回切换。需要在余额趋势模块补充收益趋势，提升趋势分析完整性。

## What Changes

- 在理财详情图表分析中，为余额趋势增加“收益趋势”展示能力。
- 收益趋势与余额趋势使用同一时间维度，支持对比观察。
- 收益趋势在折线图与列表视图中都可查看，交互与现有趋势模块保持一致。
- 保持现有接口兼容，优先基于已有 `valueTrends` 数据完成前端展示增强。

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `financial-detail-trend-multi-view`: 在余额趋势分析中增加收益趋势展示，并要求图表/列表均支持收益数据。

## Impact

- 前端：`packages/smart-house/src/routes/financial-detail/tabs/charts.tsx` 及相关趋势渲染逻辑。
- 前端格式化：收益数值展示规则与余额趋势保持一致。
- 测试：补充收益趋势在图表与列表中的可见性与数据一致性验证。
