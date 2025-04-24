export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
        Returns: { month: string; count: number }[]
      }
      get_document_processing_times: {
        Args: Record<string, never>
        Returns: { document_type: string; avg_days: number }[]
      }
      get_daily_document_processing: {
        Args: Record<string, never>
        Returns: { date: string; processed: number }[]
      }
      get_worker_status_by_agent: {
        Args: Record<string, never>
        Returns: { agent_id: string; agent_name: string; status: string; count: number }[]
      }
    }
  }
}