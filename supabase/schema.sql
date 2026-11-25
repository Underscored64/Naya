-- Naya — schema.sql
-- Apply in the Supabase SQL editor (task 02, done by the human).
--
-- Money is always an integer number of FCFA (no sub-unit).
-- Every table is owned by an auth user and isolated by Row Level Security
-- (`auth.uid() = user_id`). There are NO `for delete` policies anywhere: a
-- physical row delete of sales/expenses/repayments stays impossible even via the
-- API — corrections create a new row + mark the old one `deleted_at` (audit_log).

-- ---------------------------------------------------------------------------
create table if not exists profiles (
  user_id uuid primary key references auth.users(id),
  display_name text not null,
  business_name text,
  created_at timestamptz default now()
);

create table if not exists initial_balance (
  user_id uuid primary key references auth.users(id),
  amount int not null default 0,
  set_at date not null
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  phone text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  client_id uuid references clients(id),
  amount_total int not null check (amount_total > 0),
  amount_paid int not null default 0 check (amount_paid >= 0 and amount_paid <= amount_total),
  payment_method text not null check (payment_method in ('especes','mobile_money')),
  note text,
  source text not null default 'manuel' check (source in ('manuel','ia')),
  created_at timestamptz default now(),
  deleted_at timestamptz,
  reversed_by uuid references sales(id)
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  amount int not null check (amount > 0),
  category text not null check (category in ('stock','transport','loyer','scolarite','tontine','autre')),
  payment_method text not null check (payment_method in ('especes','mobile_money')),
  note text,
  source text not null default 'manuel' check (source in ('manuel','ia')),
  created_at timestamptz default now(),
  deleted_at timestamptz,
  reversed_by uuid references expenses(id)
);

create table if not exists repayments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  client_id uuid not null references clients(id),
  amount int not null check (amount > 0),
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: each user reads/writes only their own rows.
-- Enable RLS, then attach the "own rows" policy to every table below.
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table initial_balance enable row level security;
alter table clients enable row level security;
alter table sales enable row level security;
alter table expenses enable row level security;
alter table repayments enable row level security;
alter table audit_log enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','initial_balance','clients',
    'sales','expenses','repayments','audit_log'
  ] loop
    -- Drop any prior policy of the same name, then recreate it.
    execute format('drop policy if exists "own rows" on %I', t);
    execute format(
      'create policy "own rows" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up. The display
-- name travels in the user metadata sent at sign-up, so the front never
-- inserts into `profiles` itself (RLS would block a write to a not-yet-existing
-- row for a brand-new user). This runs as the table owner, bypassing RLS.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
