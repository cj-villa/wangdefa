# Interface Controller Coverage Checklist

- [x] `auth/auth.controller.ts`: `POST /signup`, `POST /signIn`
- [x] `fallback/fallback.controller.ts`: `ALL *`
- [x] `firefly/firefly.controller.ts`: `GET /basic`, `POST /runCron`
- [x] `financial/financial-analyze.controller.ts`: `GET /summary`
- [x] `financial/financial-net-value.controller.ts`: `GET /list`, `POST /clean`
- [x] `financial/financial-transaction.controller.ts`: `GET /list`, `POST /create`, `POST /delete`, `POST /update`
- [x] `financial/financial.controller.ts`: `GET /list`, `POST /create`, `POST /delete`, `POST /update`, `POST /clean`, `GET /detail`
- [x] `system/consul.controller.ts`: `GET /list`, `GET /detail`, `POST /update`
- [x] `system/token/token.controller.ts`: `GET /list`, `POST /create`, `POST /delete`
- [x] `wechat/subscription.controller.ts`: `GET /`, `POST /`, `GET /test`
