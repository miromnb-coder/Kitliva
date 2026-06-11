create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null check (amount > 0),
  currency text not null default 'EUR',
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_buyer_seller_different check (buyer_id <> seller_id)
);

alter table public.offers enable row level security;

create index if not exists offers_conversation_idx on public.offers(conversation_id, created_at desc);
create index if not exists offers_listing_idx on public.offers(listing_id);
create index if not exists offers_buyer_idx on public.offers(buyer_id);
create index if not exists offers_seller_idx on public.offers(seller_id);
