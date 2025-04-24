import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function createTestUser(userData: {
  email: string;
  password: string;
  role: string;
}) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    user_metadata: { role: userData.role }
  });
  
  if (error) throw error;
  return data.user.id;
}

export async function createTestWorker(workerData: {
  name: string;
  passport_number: string;
  nationality: string;
  status: string;
}) {
  const { data, error } = await supabase
    .from('workers')
    .insert({
      name: workerData.name,
      passport_number: workerData.passport_number,
      nationality: workerData.nationality,
      status: workerData.status,
      environment: 'test', // Mark as test data
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data.id;
}

export async function createTestVisa(workerId: string, visaData: {
  status: string;
  destination: string;
}) {
  const { data, error } = await supabase
    .from('visa_applications')
    .insert({
      worker_id: workerId,
      status: visaData.status,
      destination: visaData.destination,
      environment: 'test', // Mark as test data
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data.id;
}