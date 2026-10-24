-- DeepKids database. Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run again: everything is "if not exists" / "or replace".

-- 1. Each family's private documents (plan, progress, answers, routines, settings).
--    The app saves one JSON document per path, e.g. data/users/<user id>/acct_<phone>.
create table if not exists public.docs (
  path        text primary key,
  owner       uuid not null references auth.users(id) on delete cascade default auth.uid(),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
create index if not exists docs_owner on public.docs(owner);
alter table public.docs enable row level security;
drop policy if exists "own docs" on public.docs;
create policy "own docs" on public.docs for all to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid() and path like 'data/users/' || auth.uid()::text || '/%');

-- 2. Shared library: topics one family explores are saved for every family; searches help us see what's wanted.
create table if not exists public.shared (
  id          text not null,
  coll        text not null check (coll in ('topics','searches')),
  data        jsonb not null,
  by_user     uuid default auth.uid() references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  primary key (coll, id)
);
alter table public.shared enable row level security;
drop policy if exists "read shared" on public.shared;
drop policy if exists "add shared" on public.shared;
drop policy if exists "edit own shared" on public.shared;
create policy "read shared" on public.shared for select to authenticated using (coll = 'topics');
create policy "add shared" on public.shared for insert to authenticated with check (by_user = auth.uid());
create policy "edit own shared" on public.shared for update to authenticated using (by_user = auth.uid()) with check (by_user = auth.uid());

-- 3. Claude use per family per day (written only by the server function, never by the app).
create table if not exists public.ai_usage (
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         date not null,
  calls       int not null default 0,
  in_tokens   bigint not null default 0,
  out_tokens  bigint not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;   -- no policies: the app can't read or write it

-- 4. Optional invite list (used when the function's INVITE_ONLY secret is "true").
create table if not exists public.invites (
  email       text primary key,
  note        text,
  added_at    timestamptz not null default now()
);
alter table public.invites enable row level security;    -- no policies: manage it in the dashboard

-- 5. Photos and files: a private bucket; each family can only reach its own folder (<user id>/...).
insert into storage.buckets (id, name, public, file_size_limit)
values ('uploads', 'uploads', false, 20971520)
on conflict (id) do update set public = false, file_size_limit = 20971520;
drop policy if exists "own uploads read" on storage.objects;
drop policy if exists "own uploads add" on storage.objects;
drop policy if exists "own uploads remove" on storage.objects;
create policy "own uploads read" on storage.objects for select to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own uploads add" on storage.objects for insert to authenticated
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own uploads remove" on storage.objects for delete to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);

-- 6. Who may use which table through the app (row-level security above still limits each family to its own rows)
grant select, insert, update, delete on public.docs to authenticated;
grant select, insert, update on public.shared to authenticated;
revoke all on public.docs, public.shared, public.ai_usage, public.invites from anon;
revoke all on public.ai_usage, public.invites from authenticated;

-- 7. A simple view for you (dashboard only): families, last active, Claude use this month.
create or replace view public.admin_families with (security_invoker = true) as
select u.email,
       u.created_at as joined,
       (select max(d.updated_at) from public.docs d where d.owner = u.id) as last_saved,
       (select coalesce(sum(a.calls), 0) from public.ai_usage a where a.user_id = u.id and a.day >= date_trunc('month', now())::date) as claude_calls_this_month,
       (select coalesce(sum(a.in_tokens), 0) from public.ai_usage a where a.user_id = u.id and a.day >= date_trunc('month', now())::date) as in_tokens_this_month,
       (select coalesce(sum(a.out_tokens), 0) from public.ai_usage a where a.user_id = u.id and a.day >= date_trunc('month', now())::date) as out_tokens_this_month
from auth.users u;
revoke all on public.admin_families from anon, authenticated;

-- 8. DeepKids Plus: who has Plus until when (written by the payment function; each family can read its own)
create table if not exists public.plans (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  plan        text not null default 'plus',
  valid_until timestamptz not null,
  updated_at  timestamptz not null default now()
);
alter table public.plans enable row level security;
drop policy if exists "read own plan" on public.plans;
create policy "read own plan" on public.plans for select to authenticated using (user_id = auth.uid());
revoke all on public.plans from anon, authenticated;
grant select on public.plans to authenticated;

-- 9. Razorpay orders and payments (server function only)
create table if not exists public.payments (
  order_id    text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      int not null,           -- paise
  currency    text not null default 'INR',
  months      int not null,
  status      text not null default 'created',   -- created | paid
  payment_id  text,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);
alter table public.payments enable row level security;   -- no policies: the app can't read or write it
revoke all on public.payments from anon, authenticated;

-- ---------- content edits: the owner rewrites any text in the app ----------
-- After running this, add yourself as an editor (use the Google email you sign in with):
--   insert into public.editors (email) values ('you@example.com');
create table if not exists public.editors (
  email text primary key
);
alter table public.editors enable row level security;
drop policy if exists "see own editor row" on public.editors;
create policy "see own editor row" on public.editors for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

create table if not exists public.content_edits (
  k text primary key,           -- the original text as the app shows it
  t text not null,              -- the replacement text
  updated_at timestamptz not null default now()
);
alter table public.content_edits enable row level security;
drop policy if exists "everyone reads edits" on public.content_edits;
drop policy if exists "editors write edits" on public.content_edits;
create policy "everyone reads edits" on public.content_edits for select to authenticated using (true);
create policy "editors write edits" on public.content_edits for all to authenticated
  using (exists (select 1 from public.editors e where lower(e.email) = lower(auth.jwt() ->> 'email')))
  with check (exists (select 1 from public.editors e where lower(e.email) = lower(auth.jwt() ->> 'email')));
