## MODIFIED Requirements

### Requirement: Transaction net amount SHALL deduct fee
The system SHALL calculate transaction net amount by deducting fee from transaction amount before applying share/net-value computation, and the net-value reference for share calculation MUST use the Nth previous **existing** net-value record (not calendar-day subtraction).

#### Scenario: Buy transaction with fee
- **WHEN** a buy transaction has amount `A` and fee `F`
- **THEN** system uses `A - F` as effective amount for share and asset calculations
- **AND** system uses the Nth previous existing net-value record for share calculation

#### Scenario: Historical transaction without fee
- **WHEN** transaction/financial data has no fee value
- **THEN** system treats fee as `0` and preserves backward-compatible results
- **AND** system still applies existing-net-value-day lookup strategy for share calculation
