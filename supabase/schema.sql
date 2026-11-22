-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Then run seed.sql to copy in the posts and projects that were in content/.

-- ---------------------------------------------------------------- tables

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null,
  date        date not null default current_date,
  tag         text not null default 'Notes',
  excerpt     text not null default '',
  body        text not null default '',
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null,
  year        int not null default extract(year from now()),
  type        text not null default 'Other',
  status      text not null default '',
  featured    boolean not null default false,
  sort_order  int not null default 99,
  tags        text[] not null default '{}',
  blurb       text not null default '',
  images      text[] not null default '{}',
  link        text not null default '',
  repo        text not null default '',
  body        text not null default '',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- One row holding every site setting (intro, socials, bio, jobs...).
create table if not exists public.settings (
  id          int primary key default 1 check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict do nothing;

-- Who may edit. Only emails listed here can change anything.
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- security
-- Visitors can read published things. Only admins can see drafts or write.

alter table public.posts    enable row level security;
alter table public.projects enable row level security;
alter table public.settings enable row level security;
alter table public.admins   enable row level security;

drop policy if exists "read published posts" on public.posts;
create policy "read published posts" on public.posts for select using (published or public.is_admin());
drop policy if exists "admins write posts" on public.posts;
create policy "admins write posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read published projects" on public.projects;
create policy "read published projects" on public.projects for select using (published or public.is_admin());
drop policy if exists "admins write projects" on public.projects;
create policy "admins write projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read settings" on public.settings;
create policy "read settings" on public.settings for select using (true);
drop policy if exists "admins write settings" on public.settings;
create policy "admins write settings" on public.settings for update using (public.is_admin()) with check (public.is_admin());

-- admins table: no policies, so nobody can read or change it through the API.

-- ---------------------------------------------------------------- uploads
-- A public "media" bucket for images and your resume PDF.

insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 10485760)
on conflict (id) do update set public = true, file_size_limit = 10485760;

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------- you
-- The only account allowed to edit. Add more rows here (or in Table Editor -> admins) to add editors.
insert into public.admins (email) values ('dimetri.lee.2024@gmail.com') on conflict do nothing;
