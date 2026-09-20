# Kundli Milan — v1

Minimal Ashtakoot compatibility dating app. Username/password only, no email,
no OAuth. Every birth is assumed to be in India (IST) to avoid a timezone
picker. Compatibility scores are computed on the fly, nothing is cached.

## What's stored (one table: `users`)
username, password_hash, name, gender, looking_for, date_of_birth,
time_of_birth, city, is_adult, created_at. Nothing else.

## One-time setup

1. Create a Supabase project. In its SQL Editor, run
   `supabase/migrations/0001_init.sql`.
2. In Supabase -> Project Settings -> API, copy the Project URL and the
   `service_role` secret key (NOT the `anon` key).
3. Generate a session secret: any random 32+ character string works
   (e.g. run `openssl rand -base64 32` if you have a terminal, or use any
   password generator).
4. Push this project to a new GitHub repository.
5. In Vercel, "Import Project" from that GitHub repo. When it asks for
   environment variables, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SESSION_SECRET`
6. Deploy. Vercel gives you a live `https://your-app.vercel.app` URL.

## Local development (optional, needs Node.js 18+)
```
npm install
cp .env.example .env.local   # fill in the three values above
npm run dev
```

## Known limits (intentional, for v1)
- All users assumed to be in India (IST) — no timezone field.
- No photos, chat, or messaging.
- Matching is directional (you see people matching your `looking_for` gender);
  it does not require mutual interest.
- Ashtakoot scoring follows the classical male=groom/female=bride convention
  for the two directional kootas (Varna, Vashya); a same-gender pairing
  averages both orientations since no classical convention exists for it.
