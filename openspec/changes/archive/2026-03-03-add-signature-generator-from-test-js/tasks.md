## 1. Reverse Engineering & Contract Definition

- [x] 1.1 Analyze `packages/smart-house-be/src/test.js` and identify the exact input/output contract for `s["c"]`
- [x] 1.2 Define normalization rules (field ordering, type conversion, empty value handling) needed for deterministic signature generation
- [x] 1.3 Prepare fixture cases from real `test.js` examples for compatibility verification

## 2. Toolkit Implementation

- [x] 2.1 Add a signature generator utility under `packages/smart-house-be/src/shared/toolkits` implementing `s["c"]`-equivalent behavior
- [x] 2.2 Export the signature method through shared toolkit exports for module-level reuse
- [x] 2.3 Add inline documentation/comments describing expected inputs, outputs, and normalization assumptions

## 3. Test Coverage & Quality Gate

- [x] 3.1 Add unit tests that assert deterministic outputs for fixture inputs and changed outputs for changed payloads
- [x] 3.2 Add edge-case tests for mixed type inputs and empty/optional fields based on defined normalization rules
- [x] 3.3 Run `eslint` and `tsc` checks to ensure quality gate compliance before merge
