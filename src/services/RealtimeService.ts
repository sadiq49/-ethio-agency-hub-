import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const subscribeToDocumentUpdates = (userId, onUpdate) => {
  const subscription = supabase
    .channel('document-updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'documents',
      filter: `worker_id=eq.${userId}`
    }, (payload) => {
      onUpdate(payload.new);
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
};

export const subscribeToDocumentStatusHistory = (documentId, onUpdate) => {
  const subscription = supabase
    .channel('status-history-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'document_status_history',
      filter: `document_id=eq.${documentId}`
    }, (payload) => {
      onUpdate(payload.new);
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
};