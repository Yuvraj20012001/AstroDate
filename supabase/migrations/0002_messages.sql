-- Run this AFTER 0001_init.sql. Same process: Supabase -> SQL Editor -> paste -> Run.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references users(id) on delete cascade,
  recipient_id uuid not null references users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists messages_sender_idx on messages (sender_id);
create index if not exists messages_recipient_idx on messages (recipient_id);
create index if not exists messages_created_idx on messages (created_at);

-- Same model as `users`: RLS on, no policies -- only the server (service-role key)
-- can read or write this table, never a browser directly.
alter table messages enable row level security;
