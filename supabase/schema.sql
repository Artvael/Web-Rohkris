-- =========================================================
-- Skema Database Kotak Doa Rohkris SMKN 64 Jakarta
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- =========================================================

-- 1. Buat tabel prayer_requests jika belum ada
create table if not exists public.prayer_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  class_grade text,
  topic text not null,
  content text not null,
  amen_count integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.prayer_requests enable row level security;

-- 3. Policy: Izinkan siapa saja membaca (SELECT) pokok doa
drop policy if exists "Allow public read access" on public.prayer_requests;
create policy "Allow public read access"
  on public.prayer_requests for select
  using (true);

-- 4. Policy: Izinkan siapa saja mengirim (INSERT) pokok doa
drop policy if exists "Allow public insert access" on public.prayer_requests;
create policy "Allow public insert access"
  on public.prayer_requests for insert
  with check (true);

-- 5. Policy: Izinkan update jumlah Amen (UPDATE)
drop policy if exists "Allow public update amen" on public.prayer_requests;
create policy "Allow public update amen"
  on public.prayer_requests for update
  using (true)
  with check (true);

-- 6. Policy: Izinkan hapus (DELETE) untuk keperluan moderasi
drop policy if exists "Allow public delete access" on public.prayer_requests;
create policy "Allow public delete access"
  on public.prayer_requests for delete
  using (true);

-- 7. Aktifkan Realtime Replication untuk tabel prayer_requests
-- (Memungkinkan perubahan data langsung muncul di layar semua orang seketika)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'prayer_requests'
  ) then
    alter publication supabase_realtime add table public.prayer_requests;
  end if;
end $$;

-- 8. Tambahkan data permohonan doa awal jika tabel masih kosong
insert into public.prayer_requests (name, class_grade, topic, content, amen_count)
select 'Anonim (Siswa Kelas XII)', 'XII PPLG', 'Pendidikan & Ujian', 'Mohon dukungan doa untuk persiapan Ujian Sekolah & kelanjutan studi ke perguruan tinggi negeri / universitas impian. Kiranya Tuhan beri hikmat dan ketenangan.', 28
where not exists (select 1 from public.prayer_requests limit 1);

insert into public.prayer_requests (name, class_grade, topic, content, amen_count)
select 'Angelica', 'XI DKV 1', 'Keluarga', 'Doakan untuk pemulihan kesehatan Mama yang sedang dirawat dan damai sejahtera dalam keluarga kami.', 42
where (select count(*) from public.prayer_requests) = 1;

insert into public.prayer_requests (name, class_grade, topic, content, amen_count)
select 'Samuel', 'X AKL 2', 'Pertumbuhan Rohani', 'Doakan supaya saya bisa lebih setia saat teduh setiap pagi dan berani menjadi teladan bagi teman-teman sekelas.', 19
where (select count(*) from public.prayer_requests) = 2;
