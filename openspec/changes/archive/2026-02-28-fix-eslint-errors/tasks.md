## 1. Lint 基线盘点与执行入口统一

- [x] 1.1 识别并确认各工作区可用的 lint 命令（如 `smart-house`、`smart-house-be`），补充统一执行方式。
- [x] 1.2 运行全量 lint 收集当前 ESLint 报错，按工作区与规则类型建立修复清单。

## 2. 自动修复与低风险问题收敛

- [x] 2.1 对可自动修复的问题执行 ESLint `--fix` 并提交结果。
- [x] 2.2 修复格式类与导入顺序类剩余问题（如 prettier、import/order）并复检通过。

## 3. 规则级手动修复

- [x] 3.1 修复 React/Hooks 类错误（如 refs、deps）并确保组件行为不变。
- [x] 3.2 修复 TypeScript 相关 lint 错误（如未使用变量、`any`/不安全访问等）并保持接口契约不变。
- [x] 3.3 修复后端 Node/TS 规则错误（如 promise/async、异常处理、命名与导入规范）并通过 lint。

## 4. 全量验证与交付

- [x] 4.1 执行 scoped 全量 ESLint 校验，确保零 error。
- [x] 4.2 按项目要求补跑 tsc/build 验证无连带回归。
- [x] 4.3 记录本次修复范围与遗留非阻塞项（如 warning/性能提示），完成变更交付说明。
