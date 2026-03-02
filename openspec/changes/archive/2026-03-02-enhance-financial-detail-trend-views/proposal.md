## Why

理财详情的“图表分析”只能以单一图形方式查看趋势，难以进行精确对比与核对；同时净值显示精度不足，影响用户对小幅波动的判断。需要提供图表与列表双视图，并统一净值精度到小数点后 4 位。

## What Changes

- 在理财详情“图表分析”中，为“净值趋势”和“余额趋势”都增加“折线图/列表”双视图切换。
- 列表视图支持与图表视图一致的时间序列数据展示，便于核对每个时间点数值。
- 净值趋势在图表 tooltip、坐标显示（若适用）与列表中统一保留 4 位小数。
- 保持现有详情页数据接口不破坏，优先在前端展示层完成视图与精度增强。

## Capabilities

### New Capabilities
- `financial-detail-trend-multi-view`: 理财详情趋势分析支持折线图与列表双视图，并规范净值精度展示。

### Modified Capabilities
- (none)

## Impact

- 前端：`packages/smart-house/src/routes/financial-detail/tabs/charts.tsx` 及相关趋势组件。
- 前端工具层：数值格式化逻辑（净值 4 位小数）复用。
- 测试：补充趋势视图切换、净值精度显示的回归测试。
