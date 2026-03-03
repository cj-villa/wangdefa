## ADDED Requirements

### Requirement: Shared toolkit MUST provide `s["c"]`-equivalent signature generation
The backend shared toolkit SHALL provide a deterministic method that reproduces the signature behavior of `s["c"]` from `packages/smart-house-be/src/test.js` for equivalent inputs.

#### Scenario: Deterministic signature for same payload
- **WHEN** the signature method is called multiple times with the same normalized input payload
- **THEN** it MUST return the same signature string each time

#### Scenario: Signature reflects payload changes
- **WHEN** any signed input field value changes
- **THEN** the generated signature MUST change accordingly

### Requirement: Signature method MUST be reusable by backend modules
The signature generator SHALL be exported from `src/shared/toolkits` so it can be imported by other backend modules without copying algorithm logic.

#### Scenario: Toolkit export is available
- **WHEN** a backend module imports from shared toolkits
- **THEN** it can access the signature generator through the exported toolkit API

### Requirement: Signature generation MUST define input normalization rules
The implementation SHALL define and enforce normalization behavior required to match `s["c"]` behavior (including type/string conversion and field ordering rules where applicable).

#### Scenario: Mixed-type input is normalized consistently
- **WHEN** the method receives equivalent payload values in different primitive representations
- **THEN** it MUST produce the same signature as long as normalized semantic values are equivalent
