## ADDED Requirements

### Requirement: Net value list SHALL display daily change
The system SHALL provide a daily change column in the financial net value list and render the value as percentage for each row.

#### Scenario: Daily change value is available
- **WHEN** user opens the net value list and row data contains a valid daily change field
- **THEN** system displays the daily change percentage in the daily change column

#### Scenario: Daily change value is missing
- **WHEN** user opens the net value list and row data has no daily change field
- **THEN** system displays `--` in the daily change column without breaking table rendering

### Requirement: Daily change color SHALL follow rise/fall semantics
The system SHALL render positive daily change in red, negative daily change in green, and zero or invalid values in neutral style.

#### Scenario: Daily change is positive
- **WHEN** daily change value is greater than zero
- **THEN** system renders the value in red

#### Scenario: Daily change is negative
- **WHEN** daily change value is less than zero
- **THEN** system renders the value in green

#### Scenario: Daily change is zero or invalid
- **WHEN** daily change value equals zero or cannot be parsed as a valid number
- **THEN** system renders the value with neutral style
