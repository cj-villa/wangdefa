## Verification Notes

### Contract Alignment
- Frontend transaction upsert payload is normalized before request:
  - `amount` -> numeric string
  - `transactionDate`/`ensureDate` -> ISO date string
- Backend DTO validation updated to accept and validate these formats:
  - amount via `IsNumberString`
  - dates via `IsDateString`

### Implementation Checks
- Updated frontend form serialization in:
  - `packages/smart-house/src/routes/financial/tabs/financial-transaction/create-Financial-transaction.tsx`
- Updated request typings/signatures in:
  - `packages/smart-house/src/request/type/financial.ts`
  - `packages/smart-house/src/request/index.tsx`
- Updated backend DTO and normalization logic in:
  - `packages/smart-house-be/src/core/financial/application/dto/track-financial-transaction-create.dto.ts`
  - `packages/smart-house-be/src/core/financial/application/dto/track-financial-transaction-update.dto.ts`
  - `packages/smart-house-be/src/core/financial/domain/service/track-financial-transaction.service.ts`

### Commands Run
- ESLint (targeted files): pass
- `yarn build:be`: pass
- `yarn build:fe`: pass (with existing webpack size warnings)

### Notes
- Existing project-level warnings (e.g., webpack asset size warnings) remain unchanged.
