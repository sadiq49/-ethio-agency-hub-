import { supabase } from '../lib/supabase';
import { showNotification } from './NotificationService';

class DocumentRealtimeService {
  private subscriptions = [];
  
  initialize(userId) {
    // Subscribe to document status changes
    const documentSubscription = supabase
      .channel('document-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `worker_id=eq.${userId}`
      }, (payload) => {
        this.handleDocumentUpdate(payload.new, payload.old);
      })
      .subscribe();
      
    this.subscriptions.push(documentSubscription);
    
    // Subscribe to document comments
    const commentSubscription = supabase
      .channel('document-comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'document_comments',
        filter: `document_id=in.(select id from documents where worker_id=${userId})`
      }, (payload) => {
        this.handleNewComment(payload.new);
      })
      .subscribe();
      
    this.subscriptions.push(commentSubscription);
    
    return this;
  }
  
  handleDocumentUpdate(newDoc, oldDoc) {
    // If status changed, show notification
    if (newDoc.status !== oldDoc.status) {
      showNotification({
        title: 'Document Status Updated',
        body: `${newDoc.document_type} is now ${newDoc.status.replace(/_/g, ' ')}`,
        data: {
          screen: 'DocumentDetail',
          params: { documentId: newDoc.id }
        }
      });
      
      // Dispatch event for UI updates
      this.dispatchStatusChangeEvent(newDoc);
    }
  }
  
  handleNewComment(comment) {
    showNotification({
      title: 'New Document Comment',
      body: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
      data: {
        screen: 'DocumentDetail',
        params: { documentId: comment.document_id, scrollToComments: true }
      }
    });
  }
  
  dispatchStatusChangeEvent(document) {
    // Dispatch custom event for components to listen to
    const event = new CustomEvent('document_status_changed', { 
      detail: document 
    });
    document.dispatchEvent(event);
  }
  
  cleanup() {
    // Unsubscribe from all channels when component unmounts
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}

export const documentRealtimeService = new DocumentRealtimeService();