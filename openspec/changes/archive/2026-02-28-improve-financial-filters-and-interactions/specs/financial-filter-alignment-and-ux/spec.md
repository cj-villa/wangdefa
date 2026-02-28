## ADDED Requirements

### Requirement: Financial list filter options shall exclude volatile metric filters
The financial list page SHALL NOT expose "yesterday profit" or "balance" as filter controls, and SHALL keep only stable and high-frequency filters (such as name, code, and channel).

#### Scenario: List filter panel displays stable filters only
- **WHEN** user opens the financial list filter area
- **THEN** the filter controls include stable fields (name/code/channel) and do not include yesterday profit or balance filters

#### Scenario: Existing list query remains functional after filter reduction
- **WHEN** user applies available list filters and submits query
- **THEN** list data is returned correctly and pagination/reset behavior remains consistent

### Requirement: Financial transaction list API shall support current page filter set
The financial transaction list API MUST accept and apply the filtering fields currently used by the financial transaction page, and MUST return results consistent with those filters.

#### Scenario: Transaction list supports multi-field filtering
- **WHEN** user filters transaction list by supported fields (for example financialId, name/code mapping, transactionType)
- **THEN** API applies these filters on the server side and returns only matching records

#### Scenario: Backward compatibility is preserved for existing clients
- **WHEN** client sends only legacy pagination parameters
- **THEN** API behavior remains backward compatible and returns paginated results without errors

### Requirement: Financial page interactions shall provide explicit filter state and recovery actions
The financial page MUST provide clear active-filter visibility, one-click reset, and coherent loading/empty/error states with retry while preserving current filter context where possible.

#### Scenario: Active filters are visible and removable
- **WHEN** user applies one or more filters on list or transaction page
- **THEN** current filter state is visually identifiable and can be reset in a single action

#### Scenario: Error state provides direct recovery
- **WHEN** data request fails under active filters
- **THEN** UI shows error message with retry action and preserves active filter inputs for retry

### Requirement: Financial list and transaction interactions shall be behaviorally consistent
The list and transaction tabs SHALL follow a consistent interaction pattern for applying filters, clearing conditions, and handling tab switches.

#### Scenario: Switching tabs does not create ambiguous filter behavior
- **WHEN** user switches between financial list and transaction tabs
- **THEN** each tab retains or resets filter state according to defined page rules and does not produce conflicting query behavior

#### Scenario: User can complete filter-to-result workflow with minimal steps
- **WHEN** user searches target product and then views related transactions
- **THEN** the workflow requires no redundant filter re-entry beyond necessary context changes
