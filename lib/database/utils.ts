import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Server-side Supabase client (cached)
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
});

// Client-side Supabase client
export const createClientSupabaseClient = () => {
  return createClientComponentClient();
};

// Worker-related database functions
export const workerQueries = {
  // Get all workers with pagination
  getWorkers: async (supabase: any, page = 1, pageSize = 10, filters = {}) => {
    let query = supabase.from('workers').select('*, profiles!inner(full_name)', { count: 'exact' });
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,passport_number.ilike.%${filters.search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
      
    return { data, error, count, totalPages: Math.ceil(count / pageSize) };
  },
  
  // Get a single worker by ID
  getWorkerById: async (supabase: any, id: string) => {
    const { data, error } = await supabase
      .from('workers')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single();
      
    return { data, error };
  },
  
  // Create a new worker
  createWorker: async (supabase: any, workerData: any) => {
    const { data, error } = await supabase
      .from('workers')
      .insert(workerData)
      .select();
      
    return { data, error };
  },
  
  // Update a worker
  updateWorker: async (supabase: any, id: string, workerData: any) => {
    const { data, error } = await supabase
      .from('workers')
      .update(workerData)
      .eq('id', id)
      .select();
      
    return { data, error };
  },
  
  // Delete a worker
  deleteWorker: async (supabase: any, id: string) => {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);
      
    return { error };
  }
};

// Document-related database functions
export const documentQueries = {
  // Get all documents for a worker
  getWorkerDocuments: async (supabase: any, workerId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*, profiles(full_name)')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
      
    return { data, error };
  },
  
  // Get a single document by ID
  getDocumentById: async (supabase: any, id: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single();
      
    return { data, error };
  },
  
  // Create a new document
  createDocument: async (supabase: any, documentData: any) => {
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select();
      
    return { data, error };
  },
  
  // Update a document
  updateDocument: async (supabase: any, id: string, documentData: any) => {
    const { data, error } = await supabase
      .from('documents')
      .update(documentData)
      .eq('id', id)
      .select();
      
    return { data, error };
  },
  
  // Delete a document
  deleteDocument: async (supabase: any, id: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
      
    return { error };
  },
  
  // Verify a document
  verifyDocument: async (supabase: any, id: string, verifierId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .update({
        status: 'verified',
        verified_by: verifierId,
        verified_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
      
    return { data, error };
  }
};

// User profile-related database functions
export const profileQueries = {
  // Get user profile
  getUserProfile: async (supabase: any, userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    return { data, error };
  },
  
  // Update user profile
  updateUserProfile: async (supabase: any, userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select();
      
    return { data, error };
  },
  
  // Get all agents
  getAgents: async (supabase: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['agent', 'admin'])
      .order('full_name', { ascending: true });
      
    return { data, error };
  }
};

// Report-related database functions
export const reportQueries = {
  // Get worker status counts
  getWorkerStatusCounts: async (supabase: any) => {
    const { data, error } = await supabase
      .from('workers')
      .select('status, count(*)')
      .group('status');
      
    return { data, error };
  },
  
  // Get agent worker counts
  getAgentWorkerCounts: async (supabase: any) => {
    const { data, error } = await supabase
      .from('workers')
      .select('profiles!inner(full_name), count(*)')
      .group('profiles.full_name');
      
    return { data, error };
  },
  
  // Get monthly registrations
  getMonthlyRegistrations: async (supabase: any) => {
    const { data, error } = await supabase
      .rpc('get_monthly_registrations');
      
    return { data, error };
  },
  
  // Get document status counts
  getDocumentStatusCounts: async (supabase: any) => {
    const { data, error } = await supabase
      .from('documents')
      .select('status, count(*)')
      .group('status');
      
    return { data, error };
  },
  
  // Get document type counts
  getDocumentTypeCounts: async (supabase: any) => {
    const { data, error } = await supabase
      .from('documents')
      .select('document_type, count(*)')
      .group('document_type');
      
    return { data, error };
  }
};