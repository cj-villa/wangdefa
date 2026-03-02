## 1. Scope and baseline setup

- [x] 1.1 Inventory all controllers/endpoints under `packages/smart-house-be/src/interface/modules/**` and produce a coverage checklist.
- [x] 1.2 Define a unified controller unit-test scaffold using `@nestjs/testing` with dependency mocks and reusable helpers.
- [x] 1.3 Add/align DTO validation test helpers for endpoints that rely on class-validator/class-transformer behavior.

## 2. Controller test implementation

- [x] 2.1 Add missing unit tests for each controller endpoint success path with deterministic mock responses.
- [x] 2.2 Add failure-path tests for each endpoint covering invalid input and dependency-thrown exceptions.
- [x] 2.3 Refactor repetitive test setup into shared fixtures/utilities to keep test files maintainable.

## 3. Quality gate integration and verification

- [x] 3.1 Ensure all newly added interface unit tests are discoverable by existing Jest configuration.
- [x] 3.2 Run and fix backend `eslint`, `tsc`, and related Jest suites until all checks pass.
- [x] 3.3 Update change task progress and verify OpenSpec status reaches apply-ready/all artifacts done.
