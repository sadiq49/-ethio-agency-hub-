import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Create a single supabase client for interacting with your database
const supabase = createClientComponentClient<Database>();

// Example function to fetch data from a table
export async function fetchData<T>(
  tableName: string,
  options?: {
    columns?: string;
    filter?: { column: string; value: any };
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  let query = supabase.from(tableName).select(options?.columns || '*');

  if (options?.filter) {
    query = query.eq(options.filter.column, options.filter.value);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

  return data as T[];
}

// Example function to insert data into a table
export async function insertData<T>(
  tableName: string,
  data: Partial<T>
) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();

  if (error) {
    console.error('Error inserting data:', error);
    throw error;
  }

  return result as T[];
}

// Example function to update data in a table
export async function updateData<T>(
  tableName: string,
  id: number | string,
  data: Partial<T>
) {
  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return result as T[];
}

// Example function to delete data from a table
export async function deleteData(
  tableName: string,
  id: number | string
) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting data:', error);
    throw error;
  }

  return true;
}