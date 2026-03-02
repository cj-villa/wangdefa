## ADDED Requirements

### Requirement: Balance trend analysis MUST include profit trend in chart and table views
The financial detail balance trend module SHALL display both balance and profit trend data, and keep both metrics available in chart mode and table mode.

#### Scenario: User views balance trend chart
- **WHEN** user opens balance trend in chart mode
- **THEN** the chart SHALL render a balance series and a profit series on the same time axis
- **AND** users SHALL be able to distinguish the two series by legend or style

#### Scenario: User views balance trend table
- **WHEN** user switches balance trend to table mode
- **THEN** each row SHALL include date, balance and profit values
- **AND** row dates SHALL align with the chart data points

### Requirement: Profit trend and balance trend MUST use consistent source data and formatting rules
The module SHALL derive balance and profit from the same trend dataset and apply consistent amount-formatting rules for both views.

#### Scenario: Data consistency between chart and table
- **WHEN** user compares a date in chart mode and table mode
- **THEN** balance and profit values SHALL represent the same underlying record
- **AND** numeric formatting SHALL be consistent with amount display conventions
