-- Run this once in Supabase: Project -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  name text not null,
  gender text not null check (gender in ('male','female')),
  looking_for text not null check (looking_for in ('male','female')),
  date_of_birth date not null,
  time_of_birth time not null,
  city text not null,
  is_adult boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security is turned on with NO policies. That means: nobody can read
-- or write this table directly from a browser, ever. The app's server code
-- talks to Supabase using the separate service-role key, which bypasses RLS
-- entirely -- that key must never be shown to a browser or committed to git.
alter table users enable row level security;
