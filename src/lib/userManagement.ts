import { supabase } from './supabase'
import { User } from '@/types'

// User Management Functions
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching users:', error)
    throw error
  }

  return data || []
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  // In a real implementation, you'd use Supabase Auth to create the user
  // This is a simplified version for demonstration
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  return data
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    throw error
  }

  return data
}

export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export async function updateUserRole(userId: string, role: 'admin' | 'editor' | 'viewer'): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

// Check if current user is admin
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error checking user role:', error)
    return false
  }

  return data?.role === 'admin'
}

// Get user permissions
export async function getUserPermissions(userId: string): Promise<{
  canCreateEvents: boolean
  canEditEvents: boolean
  canDeleteEvents: boolean
  canManageUsers: boolean
}> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user permissions:', error)
    return {
      canCreateEvents: false,
      canEditEvents: false,
      canDeleteEvents: false,
      canManageUsers: false
    }
  }

  const role = data?.role

  return {
    canCreateEvents: role === 'admin' || role === 'editor',
    canEditEvents: role === 'admin' || role === 'editor',
    canDeleteEvents: role === 'admin',
    canManageUsers: role === 'admin'
  }
}

// Real-time subscription for user changes
export function subscribeToUserChanges(callback: (user: User) => void) {
  return supabase
    .channel('users')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'users' 
    }, (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        callback(payload.new as User)
      }
    })
    .subscribe()
}