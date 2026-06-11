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

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'offers' and policyname = 'Offer participants can view offers') then
    create policy "Offer participants can view offers" on public.offers for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'offers' and policyname = 'Buyers can create offers') then
    create policy "Buyers can create offers" on public.offers for insert to authenticated with check (auth.uid() = buyer_id and buyer_id <> seller_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'offers' and policyname = 'Sellers can update offers') then
    create policy "Sellers can update offers" on public.offers for update to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
  end if;
end $$;
