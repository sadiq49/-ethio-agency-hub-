import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadDate?: string;
  expiryDate?: string;
  url?: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.session?.user.id);

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: any, type: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.session?.user.id}/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            user_id: session.session?.user.id,
            type,
            name: file.name,
            status: 'uploaded',
            file_path: filePath,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setDocuments([...documents, data]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    uploadDocument,
    refreshDocuments: fetchDocuments,
  };
}