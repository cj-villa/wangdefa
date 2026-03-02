## ADDED Requirements

### Requirement: Financial list transaction entry MUST navigate to transaction tab with fund context
From the financial list view, clicking "View Transaction" SHALL navigate to the financial transaction tab and carry the selected fund context for pre-filtering.

#### Scenario: User clicks view transaction on list row
- **WHEN** user clicks "View Transaction" for a specific fund row
- **THEN** UI SHALL switch to the financial transaction tab
- **AND** the selected fund SHALL be pre-populated in transaction filters

### Requirement: Transaction filter UI MUST use fund selector instead of free text fields
The financial transaction filter panel SHALL hide free text fields for fund name and fund code, and provide a single fund selector component as the canonical fund filter input.

#### Scenario: User opens transaction filter panel
- **WHEN** transaction page is rendered
- **THEN** fund name and fund code text inputs MUST NOT be displayed
- **AND** a fund selector MUST be available for choosing target fund

### Requirement: Transaction list API MUST support active UI filters
The transaction list request contract SHALL accept and apply all active filters exposed by the current UI, including selected fund and existing filter dimensions.

#### Scenario: User applies filters and queries transaction list
- **WHEN** user selects a fund and submits other supported filters
- **THEN** the request payload SHALL include the same filter set shown in UI
- **AND** returned transaction data SHALL match the applied filter conditions
