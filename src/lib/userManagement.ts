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
  try {
    // First, create the auth user (this will send a magic link to the user's email)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true, // Skip email confirmation for admin-created users
      user_metadata: {
        name: userData.name
      }
    })

    if (authError) {
      // If auth creation fails but the user might already exist, try to create user record anyway
      if (authError.message.includes('already registered')) {
        // User already exists in auth, try to find their ID and create profile
        const { data: existingUser } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000
        })
        
        const foundUser = existingUser?.users?.find(u => u.email === userData.email)
        if (foundUser) {
          // Create user profile with existing auth ID
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert([{ ...userData, id: foundUser.id }])
            .select()
            .single()

          if (profileError) {
            console.error('Error creating user profile:', profileError)
            throw profileError
          }

          return profileData
        }
      }
      
      console.error('Error creating auth user:', authError)
      throw authError
    }

    // Create the user profile in the users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{ ...userData, id: authData.user.id }])
      .select()
      .single()

    if (profileError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      console.error('Error creating user profile:', profileError)
      throw profileError
    }

    return profileData

  } catch (error: any) {
    // For users who might not have auth setup yet, fall back to creating profile only
    if (error.message?.includes('admin') || error.status === 403) {
      // Fallback: create user record with generated UUID (for development/demo)
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{ ...userData, id: crypto.randomUUID() }])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user (fallback):', insertError)
        throw insertError
      }

      return data
    }
    
    throw error
  }
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