import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useDocumentRealtime(documentId) {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let subscription;
    
    async function fetchDocument() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();
          
        if (error) throw error;
        setDocument(data);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDocument();
    
    // Set up realtime subscription
    subscription = supabase
      .channel(`document-${documentId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `id=eq.${documentId}`
      }, (payload) => {
        setDocument(payload.new);
      })
      .subscribe();
      
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [documentId]);
  
  return { document, isLoading };
}