# Vercel Production Verification Notes

## 27 Ağustos 2026

- Vercel production deployment `dpl_HQKzAbAk4c63zx9scmtH3vPYbFJU` is `READY` for commit `75f15c56`.
- The public Vercel deployment now loads without Vercel SSO protection. The `/yonetim` route renders the dedicated DermaMatch administrator password screen and does not expose application data before authentication.
- The public home page renders the appointment application surface, including name, email, consultation preference, short general inquiry, two required consent checkboxes, the expandable draft KVKK/informed-consent text, and the explicit non-diagnosis/non-treatment/emergency warning.
- Production E2E submission and approval were not performed with a synthetic personal-data record. A live Neon migration and verified Resend/administrator configuration remain prerequisites for that final operational scenario.
- The first Vercel API probe was intercepted by the SPA fallback; the second reached the function but returned `FUNCTION_INVOCATION_FAILED`. The routing was made explicit and server-internal import aliases were replaced with relative paths before the subsequent production deployment was initiated.
- The isolated production route `/api/ping` on deployment `dpl_2MqtvtbJbgt3JYUqTuKQqMkvo3ET` returned `200` with `{ "ok": true, "service": "dermamatch-api" }`. Vercel serverless routing and runtime are therefore working; the remaining error is confined to the tRPC function dependency or handler path.
