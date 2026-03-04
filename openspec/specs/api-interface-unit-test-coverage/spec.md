# api-interface-unit-test-coverage Specification

## Purpose
Define baseline API interface unit test coverage requirements, including controller behavior, DTO validation, and quality-gate integration.
## Requirements
### Requirement: All API controllers MUST have baseline unit tests
The backend project SHALL provide unit tests for each controller under `src/interface/modules/**`. Each exposed endpoint MUST include at least one successful-path test and one failure-path test.

#### Scenario: Endpoint successful path is covered
- **WHEN** a controller endpoint is invoked with valid input and mocked dependencies return success
- **THEN** a unit test MUST assert the expected response or side effect for that endpoint

#### Scenario: Endpoint failure path is covered
- **WHEN** a controller endpoint receives invalid input or dependency throws an error
- **THEN** a unit test MUST assert the corresponding exception or error handling behavior

### Requirement: DTO validation and transformation behavior MUST be testable
For endpoints that rely on DTO validation/transformation, the project MUST include tests that verify accepted inputs pass and malformed inputs fail deterministically.

#### Scenario: Valid DTO payload passes validation
- **WHEN** a valid request payload is transformed and validated for an endpoint DTO
- **THEN** validation MUST pass and produce expected typed values

#### Scenario: Invalid DTO payload fails validation
- **WHEN** an invalid payload is transformed and validated for an endpoint DTO
- **THEN** validation MUST fail with field-level errors for violated constraints

### Requirement: API unit tests MUST be part of quality gate execution
API unit tests SHALL be executable in standard local/CI workflows together with lint and TypeScript checks, and failures MUST block merge readiness.

#### Scenario: Quality checks include API unit tests
- **WHEN** project quality checks run for the backend package
- **THEN** API-related unit tests execute alongside `eslint` and `tsc` checks
- **AND** any failing API unit test marks the check as failed

### Requirement: Shared signing utilities MUST have compatibility fixture tests
Utility-level tests SHALL validate signature helper compatibility against fixtures derived from known `test.js` behavior to prevent regressions in request signing.

#### Scenario: Fixture compatibility is enforced
- **WHEN** unit tests run for backend utilities
- **THEN** signature outputs for defined fixture inputs MUST match expected values

#### Scenario: Regression is detected on algorithm drift
- **WHEN** signature generation behavior changes unintentionally
- **THEN** fixture-based unit tests MUST fail and block quality checks

### Requirement: Logger transport 异常路径 MUST 有单元测试覆盖
后端测试集合 MUST 覆盖 LokiTransport 上报失败时的反馈与节流行为，确保日志可观测保障逻辑在重构后不会回归。

#### Scenario: 失败反馈被触发
- **WHEN** 单元测试模拟 LokiTransport 异常事件
- **THEN** 测试 MUST 断言结构化反馈被记录

#### Scenario: 节流策略生效
- **WHEN** 单元测试在节流窗口内模拟多次同类异常
- **THEN** 测试 MUST 断言反馈数量符合节流预期

