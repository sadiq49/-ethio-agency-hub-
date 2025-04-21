import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../supabase';
import type { Document, DocumentUploadResponse } from '../types';

export function useDocumentManagement() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadDocument = async (
    workerId: string,
    file: FileSystem.DocumentPickerResult,
    type: Document['type']
  ): Promise<DocumentUploadResponse> => {
    setUploading(true);
    setError(null);

    try {
      if (file.type !== 'success') throw new Error('File selection cancelled');

      const fileExt = file.name.split('.').pop();
      const filePath = `${workerId}/${type}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return {
        path: filePath,
        fileUrl: publicUrl,
      };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const getDocuments = async (workerId: string): Promise<Document[]> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('worker_id', workerId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    uploadDocument,
    getDocuments,
    uploading,
    error,
  };
}