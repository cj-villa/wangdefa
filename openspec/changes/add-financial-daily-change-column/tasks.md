## 1. Column and value rendering

- [x] 1.1 在 `packages/smart-house/src/routes/financial/tabs/financial/net-value-table.tsx` 新增“日涨幅”列定义，并接入现有表格渲染流程。
- [x] 1.2 实现日涨幅字段兼容映射与格式化（百分比展示、空值显示 `--`）。
- [x] 1.3 实现涨跌颜色语义：正值红色、负值绿色、零值/异常值中性样式。

## 2. Regression and quality checks

- [x] 2.1 验证新增列不影响现有筛选、分页、排序与数据加载流程。
- [x] 2.2 补充或更新相关前端单测（如存在）覆盖日涨幅渲染与颜色逻辑。（当前 smart-house 无现成前端单测脚本与测试目录，已做人工回归验证）
- [x] 2.3 本地执行 eslint 与 tsc 校验，确保本次改动满足提交门禁要求。
