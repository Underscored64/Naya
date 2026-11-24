# Naya — Architecture de données et règles métier (Livrable 3, consolidé)

## FCFA = entier
Pas de sous-unité en franc CFA : tous les montants sont des entiers (`int`). Jamais de flottant, jamais de centimes.

## Schéma Postgres (à appliquer dans l'éditeur SQL de Supabase)
```sql
create table profiles (
  user_id uuid primary key references auth.users(id),
  display_name text not null,
  business_name text,
  created_at timestamptz default now()
);

create table initial_balance (
  user_id uuid primary key references auth.users(id),
  amount int not null default 0,
  set_at date not null
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  phone text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table sales (
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

create table expenses (
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

create table repayments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  client_id uuid not null references clients(id),
  amount int not null check (amount > 0),
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table initial_balance enable row level security;
alter table clients enable row level security;
alter table sales enable row level security;
alter table expenses enable row level security;
alter table repayments enable row level security;
alter table audit_log enable row level security;

-- Même politique partout : chacune lit/écrit uniquement ses propres lignes.
-- (répéter pour chaque table : profiles, initial_balance, clients, sales, expenses, repayments, audit_log)
create policy "own rows" on sales for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Aucune policy "for delete" nulle part : la suppression physique reste impossible même via l'API.
```

## Règles de calcul (fonctions pures dans `src/engine/`, chacune testée)

- **Dette d'un client** = `Σ(sales.amount_total − amount_paid)` − `Σ(repayments.amount)`, sur les lignes non annulées (`deleted_at is null`) de ce client.
- **Solde de trésorerie** = `initial_balance.amount + Σ(sales.amount_paid) + Σ(repayments.amount) − Σ(expenses.amount)`, lignes non annulées.
- **Vente partielle** : `amount_paid < amount_total` crée mécaniquement une dette ; une seule ligne suffit.
- **Correction** : jamais un `UPDATE` sur une ligne déjà utilisée. On crée une nouvelle ligne correcte, on marque l'ancienne `deleted_at = now()` + `reversed_by = <nouvelle_id>`, on écrit une ligne `audit_log`.
- **Prévision à 7 jours** : solde actuel + dettes dont la date promise tombe dans les 7 jours − dépenses récurrentes déclarées pour la même fenêtre.

## Exemple chiffré
Solde de départ 10 000 F. Vente 15 000 F à Esi, 5 000 F encaissés (dette 10 000 F). Dépense transport 3 000 F. Esi rembourse 10 000 F trois jours après.
→ Solde = `10000+5000+10000−3000 = 22000 F`. Dette d'Esi = `0 F`.

## Audit
Chaque création/correction/annulation de `sales`, `expenses`, `repayments` écrit une ligne `audit_log`. Pas de journal sur les lectures.
