## Context

`packages/smart-house-be/src/test.js` is a bundled script where `s["c"]` is used as a signature helper, but the project lacks a readable, reusable implementation in `src/shared/toolkits`. Current usage is hard to port into service code and hard to validate because behavior is hidden inside packed runtime helpers. We need a deterministic TypeScript implementation that can be imported by backend modules and validated by unit tests.

## Goals / Non-Goals

**Goals:**
- Extract and document the effective input/output behavior of `s["c"]` from `test.js`.
- Implement an equivalent signature method under `src/shared/toolkits` with explicit type definitions.
- Export the method through toolkit entry points for future reuse.
- Add test fixtures that lock output compatibility for representative input combinations.

**Non-Goals:**
- Rebuild the whole webpack runtime from `test.js`.
- Refactor unrelated request signing code outside the new toolkit method.
- Introduce new crypto dependencies unless strictly required.

## Decisions

1. Implement a dedicated utility module in `src/shared/toolkits`.
- Rationale: keeps signature algorithm isolated, testable, and reusable.
- Alternative considered: embedding logic in a single service; rejected because it increases coupling and makes reuse harder.

2. Preserve algorithm compatibility first, optimize readability second.
- Rationale: signature mismatch is a functional failure; compatibility is the primary constraint.
- Alternative considered: designing a “clean” new algorithm API; rejected because it may diverge from `test.js` behavior.

3. Use fixture-based tests driven by known `test.js` input/output pairs.
- Rationale: fixture tests catch hidden ordering/serialization edge cases better than structural assertions only.
- Alternative considered: snapshotting full runtime output; rejected as too noisy and brittle.

4. Keep API surface small: one primary `generateSignature` (or `c`) method plus optional internal helpers.
- Rationale: reduces misuse and keeps migration simple.

## Risks / Trade-offs

- [Reverse-engineering mismatch] → Mitigation: add multiple fixtures (normal fields, empty fields, sorted/unsorted keys, numeric/string mix).
- [Hidden dependency on serialization order] → Mitigation: explicitly document and test key ordering rules.
- [Future maintenance complexity if method name is opaque (`c`)] → Mitigation: expose readable alias while preserving compatibility export.
