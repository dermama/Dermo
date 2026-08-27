# Vercel Production Verification Notes

## 27 Ağustos 2026

- Vercel production deployment `dpl_HQKzAbAk4c63zx9scmtH3vPYbFJU` is `READY` for commit `75f15c56`.
- The public Vercel deployment now loads without Vercel SSO protection. The `/yonetim` route renders the dedicated DermaMatch administrator password screen and does not expose application data before authentication.
- The public home page renders the appointment application surface, including name, email, consultation preference, short general inquiry, two required consent checkboxes, the expandable draft KVKK/informed-consent text, and the explicit non-diagnosis/non-treatment/emergency warning.
- Production E2E submission and approval were not performed with a synthetic personal-data record. A live Neon migration and verified Resend/administrator configuration remain prerequisites for that final operational scenario.
