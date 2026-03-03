## ADDED Requirements

### Requirement: Financial form SHALL support fee input
The system SHALL provide a fee input field in financial create/edit form with default value `0`, and submit this field through financial create/update APIs.

#### Scenario: Create financial with default fee
- **WHEN** user opens create financial form and does not modify fee
- **THEN** system submits fee as `0`

#### Scenario: Edit financial fee
- **WHEN** user edits an existing financial and updates fee value
- **THEN** system persists the updated fee value and returns it in subsequent detail/list queries

### Requirement: Transaction net amount SHALL deduct fee
The system SHALL calculate transaction net amount by deducting fee from transaction amount before applying share/net-value computation.

#### Scenario: Buy transaction with fee
- **WHEN** a buy transaction has amount `A` and fee `F`
- **THEN** system uses `A - F` as effective amount for share and asset calculations

#### Scenario: Historical transaction without fee
- **WHEN** transaction/financial data has no fee value
- **THEN** system treats fee as `0` and preserves backward-compatible results

### Requirement: Fee validation SHALL prevent invalid calculation
The system SHALL enforce fee input as non-negative numeric value and prevent invalid net-amount computation.

#### Scenario: Invalid negative fee
- **WHEN** user submits fee less than `0`
- **THEN** system rejects the request with validation error

#### Scenario: Fee exceeds amount
- **WHEN** effective amount would become negative due to fee greater than amount
- **THEN** system applies configured validation strategy and prevents invalid calculation persistence
