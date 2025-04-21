import { useState } from 'react';
import { supabase } from '../supabase';
import type { WorkerInsert } from '../types';

export function useWorkerRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const registerWorker = async (workerData: WorkerInsert) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('workers')
        .insert([workerData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerWorker,
    loading,
    error
  };
}