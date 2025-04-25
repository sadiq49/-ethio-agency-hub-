import { supabase } from '../lib/supabase';

export const subscribeToDocumentUpdates = (userId, callback) => {
  const subscription = supabase
    .channel('document-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

export const fetchDocumentStatistics = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('status')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const stats = {
      approvedDocuments: data.filter(doc => doc.status === 'approved').length,
      pendingDocuments: data.filter(doc => doc.status === 'pending').length,
      rejectedDocuments: data.filter(doc => doc.status === 'rejected').length
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching document statistics:', error);
    return {
      approvedDocuments: 0,
      pendingDocuments: 0,
      rejectedDocuments: 0
    };
  }
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