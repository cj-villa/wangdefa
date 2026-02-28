## 1. Financial List Filter Simplification

- [x] 1.1 Locate and remove "昨日收益" and "余额" from the financial list filter schema/UI while preserving their table display/sort behavior.
- [x] 1.2 Verify list query parameter mapping after filter reduction and ensure apply/reset flows still work correctly.
- [x] 1.3 Update related UI hints/active-filter display so users only see supported list filters.

## 2. Financial Transaction Filter Support Alignment

- [x] 2.1 Extend financial transaction query DTO/query object to support the current frontend filter fields used on the transaction page.
- [x] 2.2 Update transaction list controller/service query composition to apply new filter parameters server-side with pagination compatibility.
- [x] 2.3 Align frontend request typing and API call parameter mapping with the expanded transaction filter contract.

## 3. Page Interaction and UX Refinement

- [x] 3.1 Refine filter interaction pattern (explicit apply, one-click clear, and visible active filter state) across financial tabs.
- [x] 3.2 Standardize loading/empty/error/retry experiences for list and transaction views while retaining filter context.
- [x] 3.3 Improve element hierarchy and action grouping in financial page controls to reduce redundant clicks and improve discoverability.

## 4. Validation and Documentation

- [x] 4.1 Add/update regression checklist for list/transaction filtering, reset behavior, and tab switching continuity.
- [x] 4.2 Validate end-to-end behavior for combined filters, pagination, and error retry scenarios.
- [x] 4.3 Record acceptance notes and edge-case outcomes for this change.
