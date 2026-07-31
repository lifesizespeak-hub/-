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
  ph           numeric(3,1),
  nh3          numeric(4,2),
  no2          numeric(4,2),
  no3          numeric(5,2),
  water_added  boolean not null default false,
  work_note    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (tank_id, record_date)
);

create index idx_water_records_tank_date on water_records (tank_id, record_date desc);

-- 個人専用アプリのためRLSは無効化（将来公開する場合はここに認証・ポリシーを追加）
alter table tanks disable row level security;
alter table water_records disable row level security;

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
