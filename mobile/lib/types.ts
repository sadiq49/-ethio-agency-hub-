import { Database } from './database.types';

export type Worker = Database['public']['Tables']['workers']['Row'];
export type WorkerInsert = Database['public']['Tables']['workers']['Insert'];
export type WorkerUpdate = Database['public']['Tables']['workers']['Update'];

export interface Document {
  id: string;
  workerId: string;
  type: 'passport' | 'medical' | 'police' | 'education' | 'training';
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileUrl?: string;
  uploadDate?: string;
  expiryDate?: string;
  verificationDate?: string;
  remarks?: string;
}

export interface DocumentUploadResponse {
  path: string;
  fileUrl: string;
}