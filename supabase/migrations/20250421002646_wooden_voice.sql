/*
  # Create Workers Schema

  1. New Tables
    - `workers`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `passport_number` (text)
      - `destination` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `workers` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  passport_number text UNIQUE,
  destination text,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read workers"
  ON workers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert workers"
  ON workers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workers"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (true);