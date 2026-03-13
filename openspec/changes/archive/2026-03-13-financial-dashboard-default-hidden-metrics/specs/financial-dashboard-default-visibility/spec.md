## ADDED Requirements

### Requirement: Financial dashboard default visibility MUST prioritize pre-day profit
The system MUST default the financial list dashboard to showing only the "昨日收益" metric on first render, while keeping the other dashboard metrics available for users to reveal through existing interactions.

#### Scenario: First visit to financial list page
- **WHEN** the user opens the financial list page without any prior dashboard visibility override
- **THEN** the dashboard MUST display the "昨日收益" metric by default
- **AND** the dashboard MUST hide all other summary metrics by default

### Requirement: Financial list total amount column MUST be hidden by default
The system MUST hide the total amount column on the financial list page by default, while preserving the ability to show the column through the existing table column settings.

#### Scenario: First visit to financial list table
- **WHEN** the user opens the financial list page without any prior table column visibility override
- **THEN** the total amount column MUST be hidden by default
- **AND** the rest of the table data loading behavior MUST remain unchanged

### Requirement: Default visibility changes MUST NOT alter data contracts
The system MUST apply the new default visibility behavior only in the presentation layer and MUST NOT change summary or list API contracts.

#### Scenario: Data request after default visibility update
- **WHEN** the financial list page loads after this change
- **THEN** the page MUST continue using the existing summary and list APIs
- **AND** no request or response field contract MUST be added, removed, or renamed solely for this visibility change
