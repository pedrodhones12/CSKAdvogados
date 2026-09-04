-- CSK Advogados — estrutura do CMS de notícias
create extension if not exists pgcrypto;

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.news_categories(id) on delete set null,
  excerpt text default '',
  content text not null,
  image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.news_categories(name) values
 ('Institucional'),('Direito'),('Mercado'),('Inovação')
on conflict (name) do nothing;

alter table public.news_categories enable row level security;
alter table public.news enable row level security;

-- Leitura pública somente de notícias publicadas.
drop policy if exists "Public can read published news" on public.news;
create policy "Public can read published news" on public.news
for select using (published = true);

-- Usuários autenticados administram o conteúdo.
drop policy if exists "Authenticated can read all news" on public.news;
create policy "Authenticated can read all news" on public.news
for select to authenticated using (true);
drop policy if exists "Authenticated can insert news" on public.news;
create policy "Authenticated can insert news" on public.news
for insert to authenticated with check (true);
drop policy if exists "Authenticated can update news" on public.news;
create policy "Authenticated can update news" on public.news
for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated can delete news" on public.news;
create policy "Authenticated can delete news" on public.news
for delete to authenticated using (true);

-- Categorias: leitura pública e gerenciamento autenticado.
drop policy if exists "Public can read categories" on public.news_categories;
create policy "Public can read categories" on public.news_categories
for select using (true);
drop policy if exists "Authenticated can insert categories" on public.news_categories;
create policy "Authenticated can insert categories" on public.news_categories
for insert to authenticated with check (true);
drop policy if exists "Authenticated can delete categories" on public.news_categories;
create policy "Authenticated can delete categories" on public.news_categories
for delete to authenticated using (true);

-- Bucket público para fotos de notícias.
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view news images" on storage.objects;
create policy "Public can view news images" on storage.objects
for select using (bucket_id = 'news-images');
drop policy if exists "Authenticated can upload news images" on storage.objects;
create policy "Authenticated can upload news images" on storage.objects
for insert to authenticated with check (bucket_id = 'news-images');
drop policy if exists "Authenticated can update news images" on storage.objects;
create policy "Authenticated can update news images" on storage.objects
for update to authenticated using (bucket_id = 'news-images') with check (bucket_id = 'news-images');
drop policy if exists "Authenticated can delete news images" on storage.objects;
create policy "Authenticated can delete news images" on storage.objects
for delete to authenticated using (bucket_id = 'news-images');
