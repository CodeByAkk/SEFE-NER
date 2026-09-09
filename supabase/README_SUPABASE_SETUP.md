# NER-SAFE — Supabase setup guide

## 1. Create the Supabase project
1. Go to https://supabase.com → New project.
2. Note the **Project URL** (`https://<ref>.supabase.co`) and **anon public key**
   (Project Settings → API). The `service_role` key must NEVER go into the frontend.

## 2. Environment variables
```bash
cd project
cp .env.example .env
```
Fill in:
```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_DEMO_MODE=true
VITE_APP_URL=http://localhost:5173
```
Vite only exposes `VITE_*` vars to the browser — that is why the anon key uses that prefix.

## 3. Run database migrations (Supabase SQL Editor, in order)
1. `supabase/migrations/001_schema_a.sql`
2. `supabase/migrations/001_schema_b.sql`
3. `supabase/migrations/002_rls_a.sql`
4. `supabase/migrations/002_rls_b.sql`
5. Optional demo data: `supabase/migrations/003_seed_demo.sql`

## 4. Email auth + verification
- Authentication → Providers → Email: ON.
- Recommended: “Confirm email” ON so unverified users must verify first.
- Auth → URL Configuration → Site URL = your app URL; add redirect URLs
  (`http://localhost:5173/**` and your production domain).

## 5. Google OAuth (optional)
1. Google Cloud Console → OAuth client (Web) → authorized redirect URI:
   `https://<ref>.supabase.co/auth/v1/callback`
2. Supabase → Auth → Providers → Google: ON, paste Client ID + Secret.
3. The app calls `signInWithOAuth({ provider: 'google' })`; first-time Google
   users get a `citizen` profile from the `handle_new_user` trigger.

## 6. Create the FIRST admin (manual — never via public signup)
1. Create the user via Supabase Auth (Dashboard → Authentication → Add user),
   or sign up normally once (you will get a `citizen` profile).
2. In SQL Editor, promote that user:
```sql
update public.profiles
set role = 'admin', state = 'Meghalaya', district = 'East Khasi Hills'
where email = 'you@example.com';
```
3. Log in with that email → redirected to `/admin`.

## 7. Create officer accounts
- Log in as admin → `/admin/users` → “Create officer account”
  (assigns `field_officer`/`district_officer` + state + district).
- Or via SQL after the officer signs up once:
```sql
update public.profiles set role='field_officer', district='East Khasi Hills'
where email='rahul@example.com';
```

## 8. Storage (`evidence` bucket)
1. Storage → New bucket `evidence`, **Public: ON** (app stores only non-sensitive
   evidence URLs; gate reads through RLS-friendly app queries).
2. Add the storage policies documented at the bottom of `002_rls_b.sql`.

## 9. Run the app
```bash
cd project
npm install
npm run dev
```
Open http://localhost:5173

## 10. Role test checklist
1. Citizen signup → verify email → login → `/citizen`; visit `/admin` → Access denied.
2. Field officer login → `/field-officer`; visit `/admin` → denied.
3. District officer → `/district-officer`, only own district visible.
4. Admin → `/admin` full access; disable a user → they see “account disabled”.
5. Citizen report → visible in admin + district dashboards; field officer verifies.
6. Logout → protected routes redirect to `/login`.
