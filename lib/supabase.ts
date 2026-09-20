import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. This client uses the Supabase service-role key, which bypasses
// Row Level Security entirely. Never import this file from a Client Component
// and never expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
// All access control lives in our own session/cookie logic (lib/session.ts),
// not in Supabase's own auth system — we don't use Supabase Auth at all.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
