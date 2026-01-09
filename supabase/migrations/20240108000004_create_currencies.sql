-- Create currencies table
create table currencies (
  id text primary key,
  name text not null,
  symbol text not null
);

-- Seed currencies
insert into currencies (id, name, symbol) values
  ('USD', 'USD ($)', '$'),
  ('EUR', 'EUR (€)', '€'),
  ('TRY', 'TRY (₺)', '₺'),
  ('GBP', 'GBP (£)', '£');

-- Grant access
alter table currencies enable row level security;

create policy "Enable read access for all users"
  on currencies for select
  using (true);
