## ADDED Requirements

### Requirement: Pagination page size options MUST be unified
All paginated views MUST provide page size options exactly as `10`, `20`, and `50`.

#### Scenario: Render page size selector
- **WHEN** user opens any paginated list view
- **THEN** page size selector MUST include options `10`, `20`, and `50`

### Requirement: Page size change MUST drive standard pagination request
Changing page size MUST trigger data reload using the selected `pageSize` value while preserving existing pagination API contract.

#### Scenario: Switch page size to 50
- **WHEN** user changes page size from `10` to `50`
- **THEN** next data request MUST carry `pageSize=50`
- **AND** list data MUST refresh with the new page size

### Requirement: Pagination compatibility MUST be preserved
Unifying page size options MUST NOT introduce API contract changes for pagination fields.

#### Scenario: Existing pagination API integration
- **WHEN** frontend sends paginated request after this change
- **THEN** request fields MUST remain compatible with existing `current` and `pageSize` handling
