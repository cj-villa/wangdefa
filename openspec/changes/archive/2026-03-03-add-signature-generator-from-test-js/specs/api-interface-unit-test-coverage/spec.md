## ADDED Requirements

### Requirement: Shared signing utilities MUST have compatibility fixture tests
Utility-level tests SHALL validate signature helper compatibility against fixtures derived from known `test.js` behavior to prevent regressions in request signing.

#### Scenario: Fixture compatibility is enforced
- **WHEN** unit tests run for backend utilities
- **THEN** signature outputs for defined fixture inputs MUST match expected values

#### Scenario: Regression is detected on algorithm drift
- **WHEN** signature generation behavior changes unintentionally
- **THEN** fixture-based unit tests MUST fail and block quality checks
