## ADDED Requirements

### Requirement: Financial transaction creation payload MUST satisfy API type contract
The transaction creation flow SHALL submit payload values in formats that satisfy backend validation: `amount` MUST be a numeric string, and `transactionDate`/`ensureDate` MUST be valid date values convertible to `Date` by the API layer.

#### Scenario: Create transaction with valid formatted fields
- **WHEN** user submits create transaction form with amount and dates filled
- **THEN** request payload contains amount as numeric string and date fields as valid date values
- **AND** API accepts the request and creates the transaction successfully

#### Scenario: Reject invalid amount format
- **WHEN** client sends a non-numeric amount value
- **THEN** API rejects the request with a validation error for amount

#### Scenario: Reject invalid date values
- **WHEN** client sends unparseable values for transactionDate or ensureDate
- **THEN** API rejects the request with validation errors for the corresponding date fields

### Requirement: Backend DTO conversion and validation MUST be consistent for transaction creation
The backend transaction-create DTO MUST apply explicit value transformation and validation so that accepted client payload formats are deterministic and invalid values are rejected consistently.

#### Scenario: DTO transforms accepted date input deterministically
- **WHEN** API receives date fields in accepted client format
- **THEN** DTO conversion yields valid Date instances before business logic execution

#### Scenario: DTO fails fast on malformed input
- **WHEN** API receives malformed amount or date fields
- **THEN** request is rejected at DTO validation stage without entering service logic
