## 1. Interface Inventory and Baseline

- [x] 1.1 Enumerate all controllers and route handlers under `packages/smart-house-be/src/interface/modules/**/*controller.ts`.
- [x] 1.2 Build a Swagger coverage checklist per endpoint (tags, operation, request docs, response docs, auth docs).
- [x] 1.3 Define module-level Swagger tag naming conventions and endpoint summary style.

## 2. Controller-Level Swagger Completion

- [x] 2.1 Add or normalize `@ApiTags` for each controller to ensure consistent grouping.
- [x] 2.2 Add `@ApiOperation` for every public route handler with clear business intent summaries.
- [x] 2.3 Add request metadata decorators (`@ApiBody`, `@ApiQuery`, `@ApiParam`) where applicable.
- [x] 2.4 Add response metadata decorators (`@ApiOkResponse` or `@ApiResponse`) for every public route handler.
- [x] 2.5 Add `@ApiBearerAuth` for protected endpoints and keep public endpoints without auth requirements.

## 3. Type Alignment and Build Validation

- [x] 3.1 Reuse existing DTOs for Swagger response/request typing; create missing API DTOs only where necessary.
- [x] 3.2 Resolve import/type conflicts introduced by Swagger decorator additions.
- [x] 3.3 Run backend compile/lint checks and fix issues caused by documentation updates.

## 4. Documentation Verification and Handoff

- [ ] 4.1 Start backend in non-production mode and verify `/docs` renders all module endpoints.
- [x] 4.2 Cross-check each endpoint’s parameters, response shape, and auth requirement against controller implementation.
- [ ] 4.3 Update final checklist and confirm `openspec status --change "fill-smart-house-be-swagger-definitions"` is apply-ready.
