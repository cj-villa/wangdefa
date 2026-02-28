## Why

当前 financial 页面在“理财列表”和“理财交易”两个视图之间存在筛选项不一致、信息噪音偏高的问题，用户在同一业务链路中的筛选与对比成本较高。需要统一筛选能力并优化交互节奏，让页面操作更聚焦、结果更可预期。

## What Changes

- 在理财列表筛选区移除“昨日收益”和“余额”筛选项，保留更高频且稳定的筛选维度。
- 扩展理财交易列表接口参数能力，使其支持页面现有筛选项（如基金名称/编码/类型等已使用维度）并保持前后端一致。
- 调整 financial 页面元素布局与交互逻辑：优化筛选区信息层级、反馈方式与重置路径，减少冗余操作。
- 统一列表加载/空状态/错误反馈在 financial 页面内的表现与操作入口。

## Capabilities

### New Capabilities
- `financial-filter-alignment-and-ux`: 定义 financial 页面筛选项收敛、理财交易筛选能力补齐及交互优化的行为标准。

### Modified Capabilities
- (none)

## Impact

- Affected code:
  - `packages/smart-house/src/routes/financial/**`
  - `packages/smart-house/src/request/**`
  - `packages/smart-house-be/src/interface/modules/financial/**`
  - `packages/smart-house-be/src/core/financial/**`（如查询对象需要扩展）
- APIs:
  - 理财交易列表接口查询参数可能新增/对齐前端筛选字段。
- Dependencies:
  - 无新增三方依赖，基于现有 React + Ant Design + NestJS 体系实现。
- Systems:
  - 影响 financial 页面（理财列表与理财交易）以及对应后端查询接口行为。
