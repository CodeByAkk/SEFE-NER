# NER-SAFE — North Eastern Region Landslide Early Warning & Emergency Response

AI-assisted landslide monitoring for North Eastern India with **real Supabase
authentication + role-based access control**.

## Roles
| Role | Home | Access |
|---|---|---|
| `admin` | `/admin` | everything: users, incidents, reports, alerts, audit logs, officer creation |
| `district_officer` | `/district-officer` | own district incidents/reports, assign field verification, district alerts |
| `field_officer` | `/field-officer` | assigned incidents, submit verification reports |
| `citizen` | `/citizen` | public alerts, submit own reports, track own report status |

Role comes **only** from `public.profiles.role` (server/DB). Never from URL,
localStorage, or UI selection. Public signup is **always `citizen`**
(enforced in app code + DB trigger + CHECK constraint).

## Quick start
```bash
cd project
cp .env.example .env        # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev                 # http://localhost:5173
npm run build               # production build -> project/dist
```

## Supabase wiring (required for real auth/data)
Full steps: [`supabase/README_SUPABASE_SETUP.md`](../supabase/README_SUPABASE_SETUP.md).
Short version:
1. Create project at supabase.com → copy URL + anon key into `project/.env`.
2. SQL Editor, in order: `001_schema_a.sql` → `001_schema_b.sql` →
   `002_rls_a.sql` → `002_rls_b.sql` → optional `003_seed_demo.sql`.
3. Auth → enable Email (confirm-email recommended); optional Google OAuth.
4. Create first admin via SQL:
   ```sql
   update public.profiles set role='admin'
   where email='you@example.com';
   ```
5. Storage → bucket `evidence` (public) + policies from bottom of `002_rls_b.sql`.

## Routes
Public: `/ /login /signup /forgot-password /verify-email /setup /demo/:role`
Protected: `/admin* /district-officer* /field-officer* /citizen* /profile /change-password /alerts`

Wrong-role visits get an **Access denied** page with a link back to their own
dashboard. Disabled users (`is_active=false`) are signed out with an explanation.

## Demo Access
Landing/login show a separated **DEMO ACCESS** section (`/demo/:role`, mock
data, read-only) that never grants real access. Disable in production:
`VITE_DEMO_MODE=false`.

## Security notes
- Only `VITE_SUPABASE_ANON_KEY` in the browser. Never the service-role key.
- No passwords stored in app tables — Supabase Auth owns credentials.
- Users cannot change their own role (RLS `WITH CHECK` + admin-only paths).
- AI outputs are labelled estimates: “AI-assisted prediction. Final assessment
  should be verified by authorized personnel.”

## Files changed/added
- `project/`: Vite+React+TS app (`src/auth`, `src/pages`, `src/components`,
  `src/lib`, `.env.example`, `vite.config.ts`, `tsconfig*.json`, `index.html`)
- `supabase/migrations/`: `001_schema_a/b`, `002_rls_a/b`, `003_seed_demo`
- `supabase/README_SUPABASE_SETUP.md`: manual Supabase steps
