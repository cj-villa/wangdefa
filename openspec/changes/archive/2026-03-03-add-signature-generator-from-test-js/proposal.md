## Why

`packages/smart-house-be/src/test.js` contains a bundled/obfuscated signature generation flow, but the project currently has no reusable implementation in `src/shared/toolkits`. This makes signature logic hard to maintain, hard to test, and hard to reuse across requests that need consistent signing behavior.

## What Changes

- Analyze `packages/smart-house-be/src/test.js` and identify the effective behavior of the signature helper exposed as `s["c"]`.
- Add a new signature generation toolkit method in `packages/smart-house-be/src/shared/toolkits` that reproduces `s["c"]` behavior with clear TypeScript code.
- Export the new method through the shared toolkit entry so other modules can reuse it.
- Add focused unit tests for the new signature method with stable fixtures derived from `test.js` behavior.
- Document method input/output contract and edge-case handling.

## Capabilities

### New Capabilities
- `signature-toolkit-generator`: Provide a reusable `s["c"]`-equivalent signature generation method in shared toolkits, with deterministic output and test coverage.

### Modified Capabilities
- `api-interface-unit-test-coverage`: Extend backend utility-level test coverage to include signature generation behavior used by API request signing.

## Impact

- Affected code:
  - `packages/smart-house-be/src/shared/toolkits/*`
  - `packages/smart-house-be/src/test.js` (reference only, no behavior regression target)
  - `packages/smart-house-be/test/**` (new or updated unit tests)
- APIs: no external REST API contract change.
- Dependencies: no new runtime dependency expected.
- Risk: if reverse-engineered logic is incomplete, generated signatures may diverge; mitigated by fixture tests against `test.js` behavior.
