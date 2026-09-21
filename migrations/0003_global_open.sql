-- Keep a single open apontamento per machine: extras that looked like
-- auto-created duplicates get closed so the unique index can apply.
with keep as (
  select distinct on (equipment_id) id
  from apontamentos
  where end_time is null
  order by equipment_id, created_at asc, id asc
)
update apontamentos a
set end_time = a.start_time, updated_at = now()
where a.end_time is null
  and not exists (select 1 from keep k where k.id = a.id);

create unique index if not exists apontamentos_one_open_per_equipment
  on apontamentos (equipment_id)
  where end_time is null;

alter table presence add column if not exists activity_id text;
alter table presence add column if not exists apontamento_id text;
