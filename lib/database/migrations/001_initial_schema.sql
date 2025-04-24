-- Create enums
CREATE TYPE worker_status AS ENUM ('pending', 'active', 'inactive', 'departed', 'returned', 'missing');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE travel_status AS ENUM ('scheduled', 'checked_in', 'departed', 'arrived', 'cancelled');
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create workers table
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  passport_number TEXT NOT NULL UNIQUE,
  nationality TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  status worker_status NOT NULL DEFAULT 'pending',
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create travel arrangements table
CREATE TABLE travel_arrangements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_date TIMESTAMP WITH TIME ZONE,
  flight_number TEXT,
  ticket_number TEXT,
  status travel_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create function for monthly registrations
CREATE OR REPLACE FUNCTION get_monthly_registrations()
RETURNS TABLE (
  month TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
    COUNT(*) AS count
  FROM
    workers
  WHERE
    created_at >= NOW() - INTERVAL '6 months'
  GROUP BY
    DATE_TRUNC('month', created_at)
  ORDER BY
    DATE_TRUNC('month', created_at) ASC;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_arrangements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Workers policies
CREATE POLICY "Authenticated users can view workers"
  ON workers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Agents can create workers"
  ON workers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'agent' OR role = 'admin')
    )
  );

CREATE POLICY "Agents can update their workers"
  ON workers FOR UPDATE
  USING (
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Agents can create documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workers
      WHERE id = worker_id AND (
        agent_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Agents can update their documents"
  ON documents FOR