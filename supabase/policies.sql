-- ═══════════════════════════════════════════════════════════════
-- AL-ABBOS — RLS-политики. Применять после schema.sql.
-- Принцип: публичное чтение активного контента, всё остальное — по ролям.
-- ═══════════════════════════════════════════════════════════════

-- Включаем RLS на каждой таблице
alter table public.profiles         enable row level security;
alter table public.locations        enable row level security;
alter table public.menu_categories  enable row level security;
alter table public.menu_items       enable row level security;
alter table public.promotions       enable row level security;
alter table public.banners          enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.vacancies        enable row level security;
alter table public.job_applications enable row level security;
alter table public.site_content     enable row level security;

-- ── PROFILES ─────────────────────────────────────────────────
drop policy if exists "profiles self read"    on public.profiles;
drop policy if exists "profiles self update"  on public.profiles;
drop policy if exists "profiles self insert"  on public.profiles;
drop policy if exists "profiles admin all"    on public.profiles;

create policy "profiles self read" on public.profiles
  for select using (id = auth.uid());
create policy "profiles self insert" on public.profiles
  for insert with check (id = auth.uid());
create policy "profiles self update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
-- Админ видит и меняет всех (триггер guard разрешает смену роли только админу)
create policy "profiles admin all" on public.profiles
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── Справочники с публичным чтением активных строк ───────────
drop policy if exists "locations read"  on public.locations;
drop policy if exists "locations write" on public.locations;
create policy "locations read" on public.locations
  for select using (is_active = true or public.user_role() = 'admin');
create policy "locations write" on public.locations
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists "menu_categories read"  on public.menu_categories;
drop policy if exists "menu_categories write" on public.menu_categories;
create policy "menu_categories read" on public.menu_categories
  for select using (is_active = true or public.user_role() = 'admin');
create policy "menu_categories write" on public.menu_categories
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists "menu_items read"  on public.menu_items;
drop policy if exists "menu_items write" on public.menu_items;
create policy "menu_items read" on public.menu_items
  for select using (is_available = true or public.user_role() = 'admin');
create policy "menu_items write" on public.menu_items
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists "promotions read"  on public.promotions;
drop policy if exists "promotions write" on public.promotions;
create policy "promotions read" on public.promotions
  for select using (is_active = true or public.user_role() = 'admin');
create policy "promotions write" on public.promotions
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists "banners read"  on public.banners;
drop policy if exists "banners write" on public.banners;
create policy "banners read" on public.banners
  for select using (is_active = true or public.user_role() = 'admin');
create policy "banners write" on public.banners
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists "vacancies read"  on public.vacancies;
drop policy if exists "vacancies write" on public.vacancies;
create policy "vacancies read" on public.vacancies
  for select using (is_active = true or public.user_role() = 'admin');
create policy "vacancies write" on public.vacancies
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists "site_content read"  on public.site_content;
drop policy if exists "site_content write" on public.site_content;
create policy "site_content read" on public.site_content
  for select using (true);
create policy "site_content write" on public.site_content
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── ORDERS ───────────────────────────────────────────────────
-- Видимость: свои (клиент), назначенные (курьер), своей точки (менеджер), все (админ)
drop policy if exists "orders read"   on public.orders;
drop policy if exists "orders insert" on public.orders;
drop policy if exists "orders update" on public.orders;
drop policy if exists "orders delete" on public.orders;

create policy "orders read" on public.orders
  for select using (
    user_id = auth.uid()
    or courier_id = auth.uid()
    or (public.user_role() = 'manager' and location_id = public.user_location_id())
    or public.user_role() = 'admin'
  );

-- Создать заказ может только авторизованный клиент — на себя
create policy "orders insert" on public.orders
  for insert with check (auth.uid() = user_id);

-- Менять статус: владелец (подтверждение), курьер (доставка),
-- менеджер своей точки, админ. Логика переходов — в приложении.
create policy "orders update" on public.orders
  for update using (
    user_id = auth.uid()
    or courier_id = auth.uid()
    or (public.user_role() = 'manager' and location_id = public.user_location_id())
    or public.user_role() = 'admin'
  ) with check (
    user_id = auth.uid()
    or courier_id = auth.uid()
    or (public.user_role() = 'manager' and location_id = public.user_location_id())
    or public.user_role() = 'admin'
  );

create policy "orders delete" on public.orders
  for delete using (public.user_role() = 'admin');

-- ── ORDER_ITEMS ──────────────────────────────────────────────
drop policy if exists "order_items read"   on public.order_items;
drop policy if exists "order_items insert" on public.order_items;
drop policy if exists "order_items admin"  on public.order_items;

create policy "order_items read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.user_id = auth.uid()
          or o.courier_id = auth.uid()
          or (public.user_role() = 'manager' and o.location_id = public.user_location_id())
          or public.user_role() = 'admin'
        )
    )
  );

-- Добавлять позиции можно только к своему заказу (или админ)
create policy "order_items insert" on public.order_items
  for insert with check (
    public.user_role() = 'admin'
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items admin" on public.order_items
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── JOB_APPLICATIONS ─────────────────────────────────────────
-- Отклик может оставить любой; читать — только админ
drop policy if exists "applications insert" on public.job_applications;
drop policy if exists "applications admin"  on public.job_applications;
create policy "applications insert" on public.job_applications
  for insert with check (length(btrim(full_name)) > 0 and length(btrim(phone)) > 0);
create policy "applications admin" on public.job_applications
  for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════════
-- STORAGE — бакеты для фото (публичное чтение, запись только админ)
-- ═══════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('menu', 'menu', true),
       ('promotions', 'promotions', true),
       ('banners', 'banners', true)
on conflict (id) do nothing;

drop policy if exists "storage public read"  on storage.objects;
drop policy if exists "storage admin insert" on storage.objects;
drop policy if exists "storage admin update" on storage.objects;
drop policy if exists "storage admin delete" on storage.objects;

create policy "storage public read" on storage.objects
  for select using (bucket_id in ('menu', 'promotions', 'banners'));
create policy "storage admin insert" on storage.objects
  for insert with check (
    bucket_id in ('menu', 'promotions', 'banners')
    and public.user_role() = 'admin'
  );
create policy "storage admin update" on storage.objects
  for update using (
    bucket_id in ('menu', 'promotions', 'banners')
    and public.user_role() = 'admin'
  );
create policy "storage admin delete" on storage.objects
  for delete using (
    bucket_id in ('menu', 'promotions', 'banners')
    and public.user_role() = 'admin'
  );

-- ═══════════════════════════════════════════════════════════════
-- REALTIME — публикация изменений заказов (для отслеживания статуса)
-- ═══════════════════════════════════════════════════════════════
alter publication supabase_realtime add table public.orders;
