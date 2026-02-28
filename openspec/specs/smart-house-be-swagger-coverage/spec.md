## ADDED Requirements

### Requirement: Controller-level Swagger grouping
The system SHALL define `@ApiTags` for every controller under `packages/smart-house-be/src/interface/modules/**/*controller.ts` so API endpoints are grouped consistently in Swagger UI.

#### Scenario: Controller appears in module group
- **WHEN** Swagger documentation is generated
- **THEN** each controller appears under an explicit module tag instead of implicit or missing grouping

### Requirement: Endpoint operation summary coverage
Each public route handler MUST include `@ApiOperation` with a clear summary that describes endpoint intent.

#### Scenario: Route operation is discoverable
- **WHEN** a developer opens an endpoint in Swagger UI
- **THEN** the endpoint shows a readable operation summary for that route

### Requirement: Request contract documentation
Endpoints using path params, query params, or request body SHALL document those contracts with appropriate Swagger decorators (such as `@ApiParam`, `@ApiQuery`, `@ApiBody`) aligned with implementation DTO/query definitions.

#### Scenario: Request inputs are fully described
- **WHEN** a route expects query/body/param inputs
- **THEN** Swagger UI shows those inputs with names and types matching controller method signatures

### Requirement: Response contract documentation
Each public route handler MUST define response metadata (`@ApiOkResponse` or equivalent `@ApiResponse`) with accurate response meaning and type/schema.

#### Scenario: Response can be understood before calling API
- **WHEN** a developer reads endpoint docs in Swagger UI
- **THEN** they can identify success response semantics and expected structure without reading controller source

### Requirement: Auth semantics reflected in Swagger
For protected endpoints, the API documentation SHALL include bearer-auth requirement metadata; for explicitly public endpoints, docs SHALL make no auth requirement.

#### Scenario: Auth requirement matches runtime behavior
- **WHEN** an endpoint is guarded by auth mechanisms
- **THEN** Swagger indicates bearer auth for that endpoint or its controller group
