-- Not applied to the live database yet (waiting for approval in Supabase).
-- 10. DeepKids-track units: the full lessons live here, not in the public website files.
-- A family can read a unit if: units are open to everyone (app_settings units_open = 'true'),
-- or the family has Plus, or the unit is a free sample (free_units), or the reader is an editor.
-- New and changed units are loaded by web/upload_units.py (service key, run by GitHub Actions or by hand).
create table if not exists public.units (
  id         text primary key,
  v          text not null default '',
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.free_units (id text primary key);
create table if not exists public.app_settings (key text primary key, value text not null);
insert into public.app_settings (key, value) values ('units_open', 'true') on conflict (key) do nothing;

create or replace function public.can_read_unit(unit_id text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from app_settings where key = 'units_open' and value = 'true')
      or exists (select 1 from plans where user_id = auth.uid() and valid_until > now())
      or exists (select 1 from free_units where id = unit_id)
      or exists (select 1 from editors where lower(email) = lower(auth.jwt() ->> 'email'));
$$;
revoke all on function public.can_read_unit(text) from public, anon;
grant execute on function public.can_read_unit(text) to authenticated;

alter table public.units enable row level security;
alter table public.free_units enable row level security;
alter table public.app_settings enable row level security;
drop policy if exists "read allowed units" on public.units;
create policy "read allowed units" on public.units for select to authenticated using (public.can_read_unit(id));
drop policy if exists "read free list" on public.free_units;
create policy "read free list" on public.free_units for select to authenticated using (true);
drop policy if exists "read settings" on public.app_settings;
create policy "read settings" on public.app_settings for select to authenticated using (true);
revoke all on public.units, public.free_units, public.app_settings from anon, authenticated;
grant select on public.units, public.free_units, public.app_settings to authenticated;
