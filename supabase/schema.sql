-- ═══════════════════════════════════════════════════════════════
-- AL-ABBOS — схема базы данных (Supabase / Postgres)
-- Имена: snake_case. У всех таблиц: id uuid + created_at.
-- Порядок применения: schema.sql → policies.sql → seed.sql
-- ═══════════════════════════════════════════════════════════════

-- ── Профили (расширение auth.users) ──────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  role        text not null default 'client'
              check (role in ('client', 'courier', 'manager', 'admin')),
  location_id uuid,
  created_at  timestamptz not null default now()
);

comment on table public.profiles is 'Профили пользователей. role задаёт права; location_id — привязка курьера/менеджера к точке.';

-- ── Точки (кафе) ─────────────────────────────────────────────
create table if not exists public.locations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  address       text not null,
  lat           double precision,
  lng           double precision,
  phone         text,
  work_hours    text,
  delivery_zone text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- profiles.location_id ссылается на locations (добавляем после создания таблицы)
alter table public.profiles
  drop constraint if exists profiles_location_id_fkey;
alter table public.profiles
  add constraint profiles_location_id_fkey
  foreign key (location_id) references public.locations (id) on delete set null;

-- ── Категории меню ───────────────────────────────────────────
create table if not exists public.menu_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  sort_order integer not null default 0,
  image_url  text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Блюда ────────────────────────────────────────────────────
create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references public.menu_categories (id) on delete set null,
  name         text not null,
  description  text,
  price        integer not null check (price >= 0),
  image_url    text,
  is_available boolean not null default true,
  is_popular   boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists menu_items_category_idx on public.menu_items (category_id);

-- ── Акции ────────────────────────────────────────────────────
create table if not exists public.promotions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text,
  discount    text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Баннеры (реклама на главной) ─────────────────────────────
create table if not exists public.banners (
  id         uuid primary key default gen_random_uuid(),
  image_url  text,
  title      text,
  link       text,
  position   text not null default 'home_top',
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Заказы ───────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  location_id      uuid references public.locations (id) on delete set null,
  courier_id       uuid references auth.users on delete set null,
  status           text not null default 'new'
                   check (status in (
                     'new', 'accepted', 'cooking', 'ready',
                     'courier_assigned', 'picked_up', 'delivering',
                     'delivered', 'confirmed', 'cancelled'
                   )),
  total            integer not null default 0 check (total >= 0),
  delivery_address text not null,
  lat              double precision,
  lng              double precision,
  phone            text not null,
  comment          text,
  payment_method   text not null default 'cash'
                   check (payment_method in ('cash', 'card', 'online')),
  cancel_reason    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_courier_idx on public.orders (courier_id);
create index if not exists orders_location_idx on public.orders (location_id);
create index if not exists orders_status_idx on public.orders (status);

-- ── Позиции заказа (снимок цены и названия) ──────────────────
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name         text not null,
  price        integer not null check (price >= 0),
  qty          integer not null check (qty > 0),
  created_at   timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ── Вакансии ─────────────────────────────────────────────────
create table if not exists public.vacancies (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  location_id uuid references public.locations (id) on delete set null,
  salary      text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Отклики на вакансии ──────────────────────────────────────
create table if not exists public.job_applications (
  id         uuid primary key default gen_random_uuid(),
  vacancy_id uuid references public.vacancies (id) on delete set null,
  full_name  text not null,
  phone      text not null,
  message    text,
  created_at timestamptz not null default now()
);

-- ── Редактируемый контент сайта ──────────────────────────────
create table if not exists public.site_content (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════
-- Функции и триггеры
-- ═══════════════════════════════════════════════════════════════

-- Автосоздание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Роль текущего пользователя (security definer — без рекурсии в RLS)
create or replace function public.user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Точка, к которой привязан текущий пользователь (для менеджера/курьера)
create or replace function public.user_location_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select location_id from public.profiles where id = auth.uid()
$$;

-- Автообновление updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- Защита от самовольного повышения роли: не-админ не может менять
-- свою роль и привязку к точке (значения откатываются к старым).
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.user_role() is distinct from 'admin' then
    new.role := old.role;
    new.location_id := old.location_id;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_privileges on public.profiles;
create trigger profiles_guard_privileges
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- Триггер-функции не вызываются напрямую через REST — закрываем доступ.
-- (user_role/user_location_id оставляем — их вызывают сами RLS-политики.)
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.guard_profile_privileges() from public, anon, authenticated;

-- Атомарное оформление заказа: считает сумму по актуальным ценам меню
-- (клиентским ценам не доверяем) и создаёт заказ + позиции в одной транзакции.
create or replace function public.place_order(
  p_location_id uuid,
  p_delivery_address text,
  p_phone text,
  p_comment text,
  p_payment_method text,
  p_items jsonb
) returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total integer := 0;
  v_item record;
  v_qty integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if p_payment_method is null or p_payment_method not in ('cash', 'card', 'online') then
    p_payment_method := 'cash';
  end if;

  if length(btrim(coalesce(p_delivery_address, ''))) < 5 then
    raise exception 'bad_address';
  end if;

  insert into public.orders (
    user_id, location_id, status, total,
    delivery_address, phone, comment, payment_method
  )
  values (
    auth.uid(), p_location_id, 'new', 0,
    btrim(p_delivery_address), btrim(p_phone),
    nullif(btrim(coalesce(p_comment, '')), ''), p_payment_method
  )
  returning id into v_order_id;

  for v_item in
    select mi.id, mi.name, mi.price, (e->>'qty')::int as qty
    from jsonb_array_elements(p_items) e
    join public.menu_items mi on mi.id = (e->>'id')::uuid
    where mi.is_available = true and (e->>'qty')::int > 0
  loop
    v_qty := least(greatest(v_item.qty, 1), 99);
    insert into public.order_items (order_id, menu_item_id, name, price, qty)
    values (v_order_id, v_item.id, v_item.name, v_item.price, v_qty);
    v_total := v_total + v_item.price * v_qty;
  end loop;

  if v_total = 0 then
    raise exception 'no_items';
  end if;

  update public.orders set total = v_total where id = v_order_id;
  return v_order_id;
end;
$$;
