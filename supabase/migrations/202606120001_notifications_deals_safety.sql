create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('message', 'offer_created', 'offer_accepted', 'offer_declined', 'listing_published', 'deal_created', 'deal_updated', 'safety')),
  title text not null,
  body text not null,
  related_listing_id uuid references public.listings(id) on delete set null,
  related_conversation_id uuid references public.conversations(id) on delete set null,
  related_offer_id uuid references public.offers(id) on delete set null,
  related_deal_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  offer_id uuid not null references public.offers(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  agreed_price_amount integer not null check (agreed_price_amount > 0),
  currency text not null default 'EUR',
  status text not null default 'agreed' check (status in ('agreed', 'completed', 'cancelled')),
  handoff_method text,
  handoff_note text,
  completed_by_buyer_at timestamptz,
  completed_by_seller_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (offer_id)
);

alter table public.notifications
  add constraint notifications_related_deal_id_fkey foreign key (related_deal_id) references public.deals(id) on delete set null;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid references auth.users(id) on delete set null,
  listing_id uuid references public.listings(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  type text not null check (type in ('listing', 'user', 'conversation')),
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'action_taken')),
  created_at timestamptz not null default now()
);

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_user_id),
  check (blocker_id <> blocked_user_id)
);

create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists notifications_user_read_idx on public.notifications(user_id, is_read);
create index if not exists deals_buyer_idx on public.deals(buyer_id, created_at desc);
create index if not exists deals_seller_idx on public.deals(seller_id, created_at desc);
create index if not exists deals_conversation_idx on public.deals(conversation_id);
create index if not exists reports_reporter_idx on public.reports(reporter_id, created_at desc);
create index if not exists blocked_users_blocker_idx on public.blocked_users(blocker_id);

alter table public.notifications enable row level security;
alter table public.deals enable row level security;
alter table public.reports enable row level security;
alter table public.blocked_users enable row level security;

drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications" on public.notifications for select using (auth.uid() = user_id);

drop policy if exists "Users can update own notification read state" on public.notifications;
create policy "Users can update own notification read state" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can create notifications" on public.notifications;
create policy "Authenticated users can create notifications" on public.notifications for insert with check (auth.uid() is not null);

drop policy if exists "Deal participants can read deals" on public.deals;
create policy "Deal participants can read deals" on public.deals for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "Deal participants can create deals" on public.deals;
create policy "Deal participants can create deals" on public.deals for insert with check (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "Deal participants can update deals" on public.deals;
create policy "Deal participants can update deals" on public.deals for update using (auth.uid() = buyer_id or auth.uid() = seller_id) with check (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "Users can create reports" on public.reports;
create policy "Users can create reports" on public.reports for insert with check (auth.uid() = reporter_id);

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports" on public.reports for select using (auth.uid() = reporter_id);

drop policy if exists "Users can manage own blocked users" on public.blocked_users;
create policy "Users can manage own blocked users" on public.blocked_users for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);
