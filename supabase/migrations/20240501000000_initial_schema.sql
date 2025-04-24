-- Create schema for our application
CREATE SCHEMA IF NOT EXISTS public;

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'agent', 'user');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE worker_status AS ENUM ('registered', 'processing', 'approved', 'deployed', 'returned', 'blacklisted');
CREATE TYPE travel_status AS ENUM ('planned', 'booked', 'confirmed', 'completed', 'cancelled');

-- Create profiles table that extends the auth.users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user'::user_role,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  gender TEXT,
  date_of_birth DATE,
  nationality TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact TEXT,
  status worker_status DEFAULT 'registered'::worker_status,
  agent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status document_status DEFAULT 'pending'::document_status,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create travel arrangements table
CREATE TABLE IF NOT EXISTS travel_arrangements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  departure_date TIMESTAMPTZ,
  arrival_date TIMESTAMPTZ,
  flight_number TEXT,
  ticket_number TEXT,
  status travel_status DEFAULT 'planned'::travel_status,
  created_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hajj_umrah table for specialized religious travel
CREATE TABLE IF NOT EXISTS hajj_umrah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  travel_id UUID REFERENCES travel_arrangements(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'hajj' or 'umrah'
  visa_number TEXT,
  package_type TEXT,
  accommodation TEXT,
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_log table for auditing
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hajj_umrah ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Workers: Admins and managers can do everything, agents can only manage their own workers
CREATE POLICY "Admins and managers can do everything with workers" ON workers 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'admin' OR profiles.role = 'manager')
    )
  );

CREATE POLICY "Agents can manage their own workers" ON workers 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'agent'
      AND workers.agent_id = profiles.id
    )
  );

-- Documents: Similar policies as workers
CREATE POLICY "Admins and managers can do everything with documents" ON documents 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'admin' OR profiles.role = 'manager')
    )
  );

CREATE POLICY "Agents can manage documents for their workers" ON documents 
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN workers w ON w.agent_id = p.id
      WHERE p.id = auth.uid() 
      AND p.role = 'agent'
      AND documents.worker_id = w.id
    )
  );

-- Create functions for CRUD operations
CREATE OR REPLACE FUNCTION create_worker(
  p_full_name TEXT,
  p_gender TEXT,
  p_date_of_birth DATE,
  p_nationality TEXT,
  p_passport_number TEXT,
  p_passport_expiry DATE,
  p_phone TEXT,
  p_email TEXT,
  p_address TEXT,
  p_emergency_contact TEXT
) RETURNS UUID AS $$
DECLARE
  v_worker_id UUID;
BEGIN
  INSERT INTO workers (
    full_name, gender, date_of_birth, nationality, 
    passport_number, passport_expiry, phone, email, 
    address, emergency_contact, agent_id
  ) VALUES (
    p_full_name, p_gender, p_date_of_birth, p_nationality,
    p_passport_number, p_passport_expiry, p_phone, p_email,
    p_address, p_emergency_contact, auth.uid()
  ) RETURNING id INTO v_worker_id;
  
  RETURN v_worker_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_details JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO activity_log (
    user_id, action, entity_type, entity_id, details, ip_address
  ) VALUES (
    auth.uid(), p_action, p_entity_type, p_entity_id, p_details, current_setting('request.headers', true)::json->>'x-forwarded-for'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic logging
CREATE OR REPLACE FUNCTION trigger_log_worker_changes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_activity('create', 'worker', NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_activity('update', 'worker', NEW.id, 
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_activity('delete', 'worker', OLD.id, to_jsonb(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_worker_changes
AFTER INSERT OR UPDATE OR DELETE ON workers
FOR EACH ROW EXECUTE FUNCTION trigger_log_worker_changes();

-- Create similar triggers for other tables