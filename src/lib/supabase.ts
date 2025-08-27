import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          end_date: string | null
          type: 'inbound' | 'outbound' | 'event' | 'studytour' | 'university' | 'holiday'
          action_items: string[] | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          end_date?: string | null
          type: 'inbound' | 'outbound' | 'event' | 'studytour' | 'university' | 'holiday'
          action_items?: string[] | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          end_date?: string | null
          type?: 'inbound' | 'outbound' | 'event' | 'studytour' | 'university' | 'holiday'
          action_items?: string[] | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
      }
      event_comments: {
        Row: {
          id: string
          event_id: string
          user_id: string
          user_name: string
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          user_name: string
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          user_name?: string
          comment?: string
          created_at?: string
        }
      }
    }
  }
}