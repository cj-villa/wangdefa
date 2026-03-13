## ADDED Requirements

### Requirement: Hidden financial metrics MUST render masked values
The system MUST keep hidden financial metrics visible in layout while replacing their numeric content with `**`.

#### Scenario: Hidden dashboard metric
- **WHEN** a financial dashboard metric is in hidden state
- **THEN** the metric title and layout slot MUST remain visible
- **AND** the numeric value MUST render as `**`

### Requirement: Hidden financial table numbers MUST render masked values
The system MUST render hidden numeric fields in financial tables as `**` instead of removing the column content or collapsing layout.

#### Scenario: Hidden amount column
- **WHEN** a financial table numeric field is configured as hidden
- **THEN** the table column structure MUST remain unchanged
- **AND** the field value MUST display as `**`

### Requirement: Value masking MUST remain presentation-only
The system MUST apply value masking only in the frontend presentation layer and MUST NOT modify underlying API payloads or business calculations.

#### Scenario: Load data with hidden display enabled
- **WHEN** the page requests financial summary or list data while hidden display is enabled
- **THEN** the page MUST continue using the existing API contracts
- **AND** masking MUST happen only during rendering
