import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database/types';

// Create a single supabase client for the entire app
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// Helper functions for common database operations

// Workers
export async function getWorkers(limit = 10, offset = 0, status?: string) {
  const supabase = createServerSupabaseClient();
  
  let query = supabase
    .from('workers')
    .select('*, profiles!inner(full_name)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error, count } = await query.count('exact');
  
  return { data, error, count };
}

export async function getWorkerById(id: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('workers')
    .select('*, profiles!inner(full_name)')
    .eq('id', id)
    .single();
    
  return { data, error };
}

// Documents
export async function getDocuments(workerId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*, profiles(full_name)')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false });
    
  return { data, error };
}

export async function getDocumentById(id: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single();
    
  return { data, error };
}

// Travel arrangements
export async function getTravelArrangements(workerId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('travel_arrangements')
    .select('*')
    .eq('worker_id', workerId)
    .order('departure_date', { ascending: true });
    
  return { data, error };
}

// User profiles
export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { data, error };
}

export async function updateUserProfile(userId: string, updates: any) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  return { data, error };
}