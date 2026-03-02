## ADDED Requirements

### Requirement: Financial detail trend modules MUST support chart and table views
The financial detail analysis page SHALL provide both line chart and table view modes for balance trends and net value trends.

#### Scenario: User switches balance trend view mode
- **WHEN** user clicks the view switcher in balance trend module
- **THEN** balance trend content SHALL switch between line chart and table
- **AND** the displayed dataset SHALL remain consistent across both views

#### Scenario: User switches net value trend view mode
- **WHEN** user clicks the view switcher in net value trend module
- **THEN** net value trend content SHALL switch between line chart and table
- **AND** the displayed dataset SHALL remain consistent across both views

### Requirement: Net value display MUST keep four decimal places in analysis views
The system SHALL display net value trend numbers with exactly four decimal places in both chart-related numeric output and table cells.

#### Scenario: Net value is shown in chart tooltip or labels
- **WHEN** user hovers or reads net value numeric output in chart view
- **THEN** each net value SHALL be formatted to four decimal places

#### Scenario: Net value is shown in table view
- **WHEN** user views net value trend in table mode
- **THEN** each net value cell SHALL be formatted to four decimal places
