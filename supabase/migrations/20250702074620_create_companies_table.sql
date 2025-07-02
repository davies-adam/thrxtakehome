CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  employee_size TEXT NOT NULL,
  raw_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);

CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_companies_employee_size ON companies(employee_size);

ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
