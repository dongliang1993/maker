-- Create projects table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    user_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;

-- Create policies
create policy "Users can view their own projects"
    on public.projects for select
    using (auth.uid()::text = user_id);

create policy "Users can create their own projects"
    on public.projects for insert
    with check (auth.uid()::text = user_id);

create policy "Users can update their own projects"
    on public.projects for update
    using (auth.uid()::text = user_id);

create policy "Users can delete their own projects"
    on public.projects for delete
    using (auth.uid()::text = user_id);

-- Create indexes
create index projects_user_id_idx on public.projects(user_id);
create index projects_created_at_idx on public.projects(created_at);
create index projects_updated_at_idx on public.projects(updated_at);

-- Set up updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at(); 