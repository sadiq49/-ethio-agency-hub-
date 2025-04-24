import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Worker, Document, TravelArrangement, Profile } from "./schema";

// Create a Supabase client
const createClient = () => createClientComponentClient();

// Worker CRUD operations
export const workerUtils = {
  async getWorkers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Worker[];
  },
  
  async getWorkerById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Worker;
  },
  
  async createWorker(worker: Omit<Worker, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workers')
      .insert(worker)
      .select()
      .single();
    
    if (error) throw error;
    return data as Worker;
  },
  
  async updateWorker(id: string, updates: Partial<Omit<Worker, 'id' | 'created_at' | 'updated_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Worker;
  },
  
  async deleteWorker(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  async getWorkersByStatus(status: Worker['status']) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Worker[];
  },
  
  async getWorkersByAgent(agentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Worker[];
  }
};

// Document CRUD operations
export const documentUtils = {
  async getDocuments() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Document[];
  },
  
  async getDocumentById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Document;
  },
  
  async getDocumentsByWorker(workerId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Document[];
  },
  
  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data as Document;
  },
  
  async updateDocument(id: string, updates: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Document;
  },
  
  async deleteDocument(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  async getDocumentsByStatus(status: Document['status']) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Document[];
  }
};

// Profile CRUD operations
export const profileUtils = {
  async getProfiles() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Profile[];
  },
  
  async getProfileById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },
  
  async updateProfile(id: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  },
  
  async getCurrentUserProfile() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },
  
  async getProfilesByRole(role: Profile['role']) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Profile[];
  }
};