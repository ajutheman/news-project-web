-- profile row for every new auth user
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin insert into profiles (id, email) values (new.id, new.email) on conflict do nothing; return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- only the server (service role) or the person themselves can ask "is this user a member"
create or replace function has_active_membership(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select (coalesce(auth.jwt() ->> 'role', '') = 'service_role' or auth.uid() = uid)
     and exists (select 1 from memberships m where m.user_id = uid and m.status in ('active','past_due') and m.current_period_end > now()) $$;

-- webhook idempotency: one row per provider event id
create table webhook_events (
  id text primary key,
  provider text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table webhook_events enable row level security;   -- no policies: server only
