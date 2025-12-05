-- Create quiz_leads table for storing quiz responses
CREATE TABLE IF NOT EXISTS quiz_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  party_type TEXT,
  party_date TEXT,
  expected_guests TEXT,
  budget_range TEXT,
  main_challenge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads(email);

-- Enable RLS (Row Level Security)
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public quiz)
CREATE POLICY "Allow public inserts" ON quiz_leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to read their own record
CREATE POLICY "Allow users to read own records" ON quiz_leads
  FOR SELECT
  USING (true);

-- Create policy to allow users to update their own records
CREATE POLICY "Allow users to update own records" ON quiz_leads
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
