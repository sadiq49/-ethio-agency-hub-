/**
 * Document Processing Workflow
 * 
 * Manages the state transitions and business logic for document processing
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import apiClient from "@/lib/api-client";

export type DocumentStatus = 
  | "pending_review" 
  | "approved" 
  | "rejected" 
  | "expired" 
  | "needs_correction";

export type DocumentType = 
  | "passport"
  | "visa"
  | "work_permit"
  | "medical_certificate"
  | "contract";

export interface DocumentTransition {
  from: DocumentStatus;
  to: DocumentStatus;
  action: string;
  requiredRole: string[];
}

// Define allowed state transitions
const allowedTransitions: DocumentTransition[] = [
  { from: "pending_review", to: "approved", action: "approve", requiredRole: ["admin", "processor"] },
  { from: "pending_review", to: "rejected", action: "reject", requiredRole: ["admin", "processor"] },
  { from: "pending_review", to: "needs_correction", action: "request_correction", requiredRole: ["admin", "processor"] },
  { from: "needs_correction", to: "pending_review", action: "resubmit", requiredRole: ["user", "admin"] },
  { from: "rejected", to: "pending_review", action: "resubmit", requiredRole: ["user", "admin"] },
  { from: "approved", to: "expired", action: "expire", requiredRole: ["system", "admin"] },
];

export class DocumentWorkflow {
  private supabase = createClientComponentClient();
  
  /**
   * Transition a document from one status to another
   */
  async transitionDocument(
    documentId: string,
    action: string,
    notes: string = "",
    userId: string
  ) {
    // Get current document status
    const { data: document, error: fetchError } = await this.supabase
      .from('documents')
      .select('status, worker_id, document_type')
      .eq('id', documentId)
      .single();
      
    if (fetchError) {
      throw new Error(`Failed to fetch document: ${fetchError.message}`);
    }
    
    // Get user role
    const { data: profile, error: profileError } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }
    
    const userRole = profile.role;
    const currentStatus = document.status;
    
    // Find the transition
    const transition = allowedTransitions.find(
      t => t.from === currentStatus && t.action === action
    );
    
    if (!transition) {
      throw new Error(`Invalid transition: ${currentStatus} -> ${action}`);
    }
    
    // Check if user has permission
    if (!transition.requiredRole.includes(userRole) && !transition.requiredRole.includes("system")) {
      throw new Error(`User does not have permission to perform this action`);
    }
    
    // Perform the transition
    const newStatus = transition.to;
    const now = new Date().toISOString();
    
    // Update document status
    const { error: updateError } = await apiClient.writeAndInvalidate('documents', async () => {
      return this.supabase
        .from('documents')
        .update({
          status: newStatus,
          processed_at: now,
          processor_id: userId,
          notes: notes,
          processing_time: this.calculateProcessingTime(document.submitted_at, now)
        })
        .eq('id', documentId);
    });
    
    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`);
    }
    
    // Create notification for document owner
    await this.createNotification(
      document.worker_id,
      `Document ${this.formatDocumentType(document.document_type)} ${this.formatStatus(newStatus)}`,
      `Your ${this.formatDocumentType(document.document_type)} has been ${this.formatStatus(newStatus).toLowerCase()}${notes ? `: ${notes}` : '.'}`,
      this.getNotificationType(newStatus),
      "document",
      documentId
    );
    
    return { success: true, newStatus };
  }
  
  /**
   * Calculate processing time in hours
   */
  private calculateProcessingTime(submittedAt: string, processedAt: string): number {
    const submitted = new Date(submittedAt).getTime();
    const processed = new Date(processedAt).getTime();
    return (processed - submitted) / (1000 * 60 * 60); // Convert ms to hours
  }
  
  /**
   * Format document type for display
   */
  private formatDocumentType(type: string): string {
    return type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  
  /**
   * Format status for display
   */
  private formatStatus(status: DocumentStatus): string {
    switch (status) {
      case "pending_review": return "Pending Review";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "expired": return "Expired";
      case "needs_correction": return "Needs Correction";
      default: return status;
    }
  }
  
  /**
   * Get notification type based on document status
   */
  private getNotificationType(status: DocumentStatus): "info" | "success" | "warning" | "error" {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "error";
      case "needs_correction": return "warning";
      case "expired": return "warning";
      default: return "info";
    }
  }
  
  /**
   * Create a notification
   */
  private async createNotification(
    userId: string,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error",
    relatedTo: "document" | "worker" | "travel" | "system",
    relatedId: string | null = null
  ) {
    const { error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        related_to: relatedTo,
        related_id: relatedId,
        read: false
      });
      
    if (error) {
      console.error("Failed to create notification:", error);
    }
  }
}

// Create singleton instance
const documentWorkflow = new DocumentWorkflow();
export default documentWorkflow;