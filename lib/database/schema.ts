export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'user' | 'agent' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'user' | 'agent' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'user' | 'agent' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      workers: {
        Row: {
          id: string
          full_name: string
          passport_number: string
          nationality: string
          gender: string
          date_of_birth: string
          phone_number: string
          email: string | null
          address: string
          status: 'pending' | 'active' | 'inactive' | 'departed' | 'returned' | 'missing'
          agent_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          passport_number: string
          nationality: string
          gender: string
          date_of_birth: string
          phone_number: string
          email?: string | null
          address: string
          status?: 'pending' | 'active' | 'inactive' | 'departed' | 'returned' | 'missing'
          agent_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          passport_number?: string
          nationality?: string
          gender?: string
          date_of_birth?: string
          phone_number?: string
          email?: string | null
          address?: string
          status?: 'pending' | 'active' | 'inactive' | 'departed' | 'returned' | 'missing'
          agent_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          worker_id: string
          document_type: string
          file_path: string
          file_name: string
          status: 'pending' | 'verified' | 'rejected' | 'expired'
          verified_by: string | null
          verified_at: string | null
          expiry_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          worker_id: string
          document_type: string
          file_path: string
          file_name: string
          status?: 'pending' | 'verified' | 'rejected' | 'expired'
          verified_by?: string | null
          verified_at?: string | null
          expiry_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          worker_id?: string
          document_type?: string
          file_path?: string
          file_name?: string
          status?: 'pending' | 'verified' | 'rejected' | 'expired'
          verified_by?: string | null
          verified_at?: string | null
          expiry_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      travel_arrangements: {
        Row: {
          id: string
          worker_id: string
          destination: string
          departure_date: string
          arrival_date: string | null
          flight_number: string | null
          ticket_number: string | null
          status: 'scheduled' | 'checked_in' | 'departed' | 'arrived' | 'cancelled'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          worker_id: string
          destination: string
          departure_date: string
          arrival_date?: string | null
          flight_number?: string | null
          ticket_number?: string | null
          status?: 'scheduled' | 'checked_in' | 'departed' | 'arrived' | 'cancelled'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          worker_id?: string
          destination?: string
          departure_date?: string
          arrival_date?: string | null
          flight_number?: string | null
          ticket_number?: string | null
          status?: 'scheduled' | 'checked_in' | 'departed' | 'arrived' | 'cancelled'
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Functions: {
      get_monthly_registrations: {
        Args: Record<string, never>
        Returns: {
          month: string
          count: number
        }[]
      }
    }
  }
}


export type WorkerStatus = 'pending' | 'active' | 'inactive' | 'departed' | 'returned' | 'missing';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type TravelStatus = 'scheduled' | 'checked_in' | 'departed' | 'arrived' | 'cancelled';
export type UserRole = 'user' | 'agent' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Worker {
  id: string;
  full_name: string;
  passport_number: string;
  nationality: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  email?: string;
  address: string;
  status: WorkerStatus;
  agent_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Document {
  id: string;
  worker_id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  status: DocumentStatus;
  verified_by?: string;
  verified_at?: string;
  expiry_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface TravelArrangement {
  id: string;
  worker_id: string;
  destination: string;
  departure_date: string;
  arrival_date?: string;
  flight_number?: string;
  ticket_number?: string;
  status: TravelStatus;
  created_at: string;
  updated_at?: string;
}