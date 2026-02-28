## Verification Notes

### Lint Commands Unified
- Added root scripts in `/Users/luchenjie/Documents/code/cj-villa/wangdefa/package.json`:
  - `lint:fe`: `eslint packages/smart-house/src --ext .ts,.tsx`
  - `lint:be`: `eslint packages/smart-house-be/src --ext .ts,.tsx`
  - `lint`: runs both `lint:fe` and `lint:be`

### Lint Results
- `yarn lint:fe`: 0 errors, 6 warnings
- `yarn lint:be`: 0 errors, 2 warnings
- Combined scoped result: **0 ESLint errors**

### Build / Type Validation
- `yarn build:fe`: pass (webpack warnings about bundle size)
- `yarn build:be`: pass

### Residual Non-Blocking Items
- React hooks exhaustive-deps warnings in several frontend files.
- `no-console` warnings in backend/frontend existing logs.
- Webpack asset/entry size warnings during frontend build.

These are tracked as non-blocking warnings and were not changed in this pass to keep behavior and scope stable.
