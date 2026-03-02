## 1. Long-running request behavior alignment

- [x] 1.1 Locate update-net-value action handlers in `net-value-table.tsx` and `financial-transaction.tsx` and confirm current timeout/loading flow.
- [x] 1.2 Remove frontend timeout interruption for update-net-value requests in both pages so request can wait until server response.
- [x] 1.3 Ensure both handlers use a single in-flight state guard to block duplicate clicks during request execution.

## 2. Interaction feedback consistency

- [x] 2.1 Keep update button loading state active throughout the full request lifecycle and clear only in `finally`.
- [x] 2.2 Standardize success/failure feedback messages for update-net-value action across both pages.
- [x] 2.3 Verify action re-enables correctly after success and after failure without stale loading state.

## 3. Verification and quality checks

- [x] 3.1 Add/adjust targeted UI behavior tests (or interaction assertions) for long-running update action where applicable.
- [x] 3.2 Run frontend `eslint` and `tsc` checks and fix any issues introduced by the interaction changes.
- [x] 3.3 Confirm OpenSpec tasks are updated and change status is apply-ready.
