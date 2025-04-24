import { supabase } from '../lib/supabase';

export const subscribeToDocumentUpdates = (documentId, callback) => {
  const subscription = supabase
    .channel(`document-${documentId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'documents',
      filter: `id=eq.${documentId}`
    }, (payload) => {
      callback(payload.new);
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
};

export const subscribeToUserDocuments = (userId, callback) => {
  const subscription = supabase
    .channel(`user-documents-${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'documents',
      filter: `worker_id=eq.${userId}`
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
};