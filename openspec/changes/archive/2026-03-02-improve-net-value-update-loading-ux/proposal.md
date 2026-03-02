## Why

理财页面“更新净值”调用可能持续较长时间，当前前端请求存在超时后中断的问题，用户会误判为失败并重复触发操作。需要将交互改为长任务友好模式，保证任务执行期间持续 loading 并给出清晰状态反馈。

## What Changes

- 调整 `net-value-table.tsx` 的“更新净值”请求策略，移除前端超时限制，执行期间保持 loading 直到接口返回。
- 调整 `financial-transaction.tsx` 的“更新净值”请求策略，移除前端超时限制，执行期间保持 loading 直到接口返回。
- 统一两个页面的长耗时交互反馈：请求中禁用重复点击、完成后恢复可操作并提示结果。

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `financial-filter-alignment-and-ux`: 优化理财相关页面长耗时“更新净值”操作的请求与 loading 交互行为，避免前端超时打断任务。

## Impact

- Affected code: `packages/smart-house/src/routes/financial/tabs/financial/net-value-table.tsx`, `packages/smart-house/src/routes/financial/tabs/financial-transaction/financial-transaction.tsx`。
- APIs: 不新增后端接口，仅调整前端调用策略与交互表现。
- UX: 用户在长耗时更新期间将获得持续进度反馈，减少重复操作与误判失败。
