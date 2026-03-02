## ADDED Requirements

### Requirement: Fund detail metrics MUST be scoped to selected fund only
The system SHALL calculate and display fund detail metrics (including current balance, accumulated profit, holding amount and related summary fields) strictly from the selected fund record instead of account-wide aggregates.

#### Scenario: User opens detail page for a specific fund
- **WHEN** user navigates to a fund detail page with fund identifier `F1`
- **THEN** all key metrics SHALL be derived only from data belonging to `F1`
- **AND** values from other funds MUST NOT be included

### Requirement: Fund detail data source MUST be deterministic
The detail page data pipeline SHALL use an explicit fund identifier as the primary filter key for both initial load and refresh.

#### Scenario: Detail page refresh after switching funds
- **WHEN** user switches from fund `F1` to `F2` and triggers refresh
- **THEN** the refresh request and rendering SHALL use `F2` as the only metric scope
- **AND** stale values from `F1` MUST be cleared before rendering new results
