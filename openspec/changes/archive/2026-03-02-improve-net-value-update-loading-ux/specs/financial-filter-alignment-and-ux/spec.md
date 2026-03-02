## ADDED Requirements

### Requirement: Net value update action MUST support long-running request without frontend timeout interruption
When users trigger net value updates from financial-related tabs, the frontend SHALL keep the request active without client-side timeout interruption and wait for explicit server response.

#### Scenario: Update request exceeds previous timeout threshold
- **WHEN** user clicks the net value update action and the backend processing time is long
- **THEN** frontend request MUST remain pending without timeout-triggered failure
- **AND** loading state remains active until the server returns success or error

### Requirement: Net value update action MUST prevent duplicate submits during in-flight request
The update trigger in both affected pages SHALL disable repeated triggering while the current update request is in progress.

#### Scenario: User clicks update multiple times quickly
- **WHEN** the first update request is in progress
- **THEN** subsequent clicks MUST NOT create additional update requests
- **AND** the UI keeps a single in-flight loading indication

### Requirement: Net value update feedback MUST be consistent across financial tabs
The financial net value tab and financial transaction tab SHALL use consistent success and failure feedback patterns for update actions, and recover interaction state in a deterministic way.

#### Scenario: Update succeeds after long wait
- **WHEN** update request completes successfully
- **THEN** both tabs display consistent success feedback
- **AND** loading state is cleared and actions become clickable again

#### Scenario: Update fails after long wait
- **WHEN** update request returns an error
- **THEN** both tabs display consistent failure feedback with error context
- **AND** loading state is cleared and actions become clickable again
