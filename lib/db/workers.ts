import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export type Worker = {
  id: string;
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  passport_number?: string;
  passport_expiry?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  status: 'registered' | 'processing' | 'approved' | 'deployed' | 'returned' | 'blacklisted';
  agent_id?: string;
  created_at: string;
  updated_at: string;
};

export type WorkerFormData = Omit<Worker, 'id' | 'created_at' | 'updated_at' | 'agent_id' | 'status'>;

// Server-side functions
export async function getWorkers(limit = 10, offset = 0, status?: Worker['status']) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  let query = supabase
    .from('workers')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error, count } = await query.returns<Worker[]>();
  
  if (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
  
  return { workers: data || [], count };
}

export async function getWorkerById(id: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single()
    .returns<Worker>();
  
  if (error) {
    console.error(`Error fetching worker with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Client-side functions
export function useWorkerActions() {
  const supabase = createClientComponentClient<Database>();
  
  const createWorker = async (workerData: WorkerFormData) => {
    const { data, error } = await supabase
      .from('workers')
      .insert({
        ...workerData,
        status: 'registered',
      })
      .select()
      .single()
      .returns<Worker>();
    
    if (error) {
      console.error('Error creating worker:', error);
      throw error;
    }
    
    return data;
  };
  
  const updateWorker = async (id: string, workerData: Partial<WorkerFormData>) => {
    const { data, error } = await supabase
      .from('workers')
      .update({
        ...workerData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
      .returns<Worker>();
    
    if (error) {
      console.error(`Error updating worker with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  };
  
  const updateWorkerStatus = async (id: string, status: Worker['status']) => {
    const { data, error } = await supabase
      .from('workers')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
      .returns<Worker>();
    
    if (error) {
      console.error(`Error updating status for worker with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  };
  
  const deleteWorker = async (id: string) => {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting worker with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  };
  
  return {
    createWorker,
    updateWorker,
    updateWorkerStatus,
    deleteWorker,
  };
}