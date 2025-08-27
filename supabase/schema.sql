-- Database schema for OIAA Calendar
-- Run this in your Supabase SQL editor

-- Create custom types
create type event_type as enum ('inbound', 'outbound', 'event', 'studytour', 'university', 'holiday');
create type user_role as enum ('admin', 'editor', 'viewer');

-- Create users table
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null,
  role user_role default 'viewer',
  created_at timestamptz default now()
);

-- Create events table
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date not null,
  end_date date,
  type event_type not null,
  action_items text[],
  created_by uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create event_comments table
create table if not exists public.event_comments (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  user_name text not null,
  comment text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.event_comments enable row level security;

-- Create policies
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

create policy "Everyone can view events" on public.events for select using (true);
create policy "Editors and admins can insert events" on public.events for insert with check (
  exists (
    select 1 from public.users 
    where id = auth.uid() and role in ('admin', 'editor')
  )
);
create policy "Editors and admins can update events" on public.events for update using (
  exists (
    select 1 from public.users 
    where id = auth.uid() and role in ('admin', 'editor')
  )
);
create policy "Admins can delete events" on public.events for delete using (
  exists (
    select 1 from public.users 
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Everyone can view comments" on public.event_comments for select using (true);
create policy "Authenticated users can insert comments" on public.event_comments for insert with check (auth.uid() = user_id);
create policy "Users can update their own comments" on public.event_comments for update using (auth.uid() = user_id);
create policy "Admins can delete any comment" on public.event_comments for delete using (
  exists (
    select 1 from public.users 
    where id = auth.uid() and role = 'admin'
  )
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for events table
create trigger handle_events_updated_at
  before update on public.events
  for each row execute procedure public.handle_updated_at();

-- Create function to automatically create user profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', 'Unknown User'));
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert sample data (optional)
-- This would be handled through the application instead