-- 水槽マスタ
create table tanks (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- 日々の水質・作業記録（1水槽×1日＝1レコード）
create table water_records (
  id           uuid primary key default gen_random_uuid(),
  tank_id      uuid not null references tanks(id) on delete cascade,
  record_date  date not null,
  ph           numeric(3,1),  -- 単位なし
  nh3          numeric(4,2),  -- アンモニア(ppm / mg/L)
  no2          numeric(4,2),  -- 亜硝酸(ppm / mg/L)
  no3          numeric(5,2),  -- 硝酸塩(ppm / mg/L)
  water_temp   numeric(4,1),  -- 水温(℃)
  water_added  boolean not null default false,
  work_note    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (tank_id, record_date)
);

create index idx_water_records_tank_date on water_records (tank_id, record_date desc);

-- RLSを有効化する。ログイン機能はまだ無いため、anon/authenticatedロールに全操作を許可するポリシーを設定する
-- （将来ログイン機能を追加する場合は、ここをuser_id列とauth.uid()に基づくポリシーへ差し替える）
alter table tanks enable row level security;
alter table water_records enable row level security;

create policy "tanks_allow_all" on tanks
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "water_records_allow_all" on water_records
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- updated_at 自動更新
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger water_records_set_updated_at
before update on water_records
for each row execute function set_updated_at();
