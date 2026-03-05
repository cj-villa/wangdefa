# financial-share-net-value-reference Specification

## Purpose
TBD - created by archiving change use-existing-net-value-days-for-share-calc. Update Purpose after archive.
## Requirements
### Requirement: Share calculation MUST use existing net-value days
The system MUST resolve net value for share calculation by traversing historical net-value records and selecting the Nth previous **existing** net-value entry before the target transaction date, instead of subtracting N calendar days directly.

#### Scenario: Missing net value on calendar day
- **WHEN** transaction needs net value offset `N` and the calendar-day target has no net-value record
- **THEN** system MUST continue traversing previous dates with existing net value until the Nth existing record is found

#### Scenario: Existing net value sequence available
- **WHEN** there are enough historical net-value records before transaction effective date
- **THEN** system MUST select the Nth previous existing net-value record and use it for share calculation

### Requirement: Net-value lookup MUST fail explicitly when insufficient history
The system MUST reject share calculation when historical existing net-value records are fewer than required offset, to prevent silent incorrect share persistence.

#### Scenario: Insufficient existing records
- **WHEN** required offset `N` is greater than available existing net-value records before effective date
- **THEN** system MUST raise a business validation error indicating insufficient net-value history

