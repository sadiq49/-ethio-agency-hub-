import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Worker = Database['public']['Tables']['workers']['Row'];

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setWorkers(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const addWorker = async (worker: Omit<Worker, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert([worker])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setWorkers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateWorker = async (id: string, updates: Partial<Worker>) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setWorkers(prev => prev.map(worker => 
        worker.id === id ? { ...worker, ...data } : worker
      ));
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    workers,
    loading,
    error,
    addWorker,
    updateWorker
  };
}