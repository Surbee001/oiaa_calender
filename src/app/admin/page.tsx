'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { Users, Settings, Shield, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginForm'
import { getAllUsers, createUser, updateUser, deleteUser, isCurrentUserAdmin } from '@/lib/userManagement'
import { supabase } from '@/lib/supabase'

// Initial admin users to seed the database
const initialAdminUsers = [
  { email: 'h.mroue@ajman.ac.ae', name: 'H. Mroue', role: 'admin' as const },
  { email: 'ayesha.alfalasi@ajman.ac.ae', name: 'Ayesha Alfalasi', role: 'admin' as const },
  { email: 'ibrahim.ragab@ajman.ac.ae', name: 'Ibrahim Ragab', role: 'admin' as const },
  { email: 'l.alkalbani@ajman.ac.ae', name: 'L. Alkalbani', role: 'admin' as const },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer' as const })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Seed initial admin users if database is empty
  const seedAdminUsers = async () => {
    try {
      const existingUsers = await getAllUsers()
      if (existingUsers.length === 0) {
        console.log('Database is empty, seeding initial admin users...')
        
        // Database is empty, seed with initial admin users
        const createdUsers = []
        for (const adminUser of initialAdminUsers) {
          try {
            const newUser = await createUser(adminUser)
            createdUsers.push(newUser)
            console.log(`Created admin user: ${adminUser.email}`)
          } catch (err: any) {
            console.error(`Failed to create user ${adminUser.email}:`, err)
            
            // If user creation fails, try to check if they already exist in the database
            try {
              const existingUser = await getAllUsers()
              const found = existingUser.find(u => u.email === adminUser.email)
              if (found) {
                createdUsers.push(found)
                console.log(`User ${adminUser.email} already exists in database`)
              }
            } catch (checkErr) {
              console.error('Error checking for existing user:', checkErr)
            }
          }
        }
        
        // Return all users (existing + newly created)
        const allUsers = await getAllUsers()
        console.log(`Total users in database: ${allUsers.length}`)
        return allUsers
      }
      return existingUsers
    } catch (err) {
      console.error('Error seeding admin users:', err)
      // Return empty array as fallback
      return []
    }
  }

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsAuthenticated(false)
          setAuthLoading(false)
          return
        }

        // Check if user is admin
        const isAdmin = await isCurrentUserAdmin()
        if (!isAdmin) {
          setError('Access denied. Admin privileges required.')
          setIsAuthenticated(false)
          setAuthLoading(false)
          return
        }

        setIsAuthenticated(true)
        setAuthLoading(false)
      } catch (err) {
        console.error('Auth check failed:', err)
        setIsAuthenticated(false)
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const isAdmin = await isCurrentUserAdmin()
          setIsAuthenticated(isAdmin)
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false)
        }
        setAuthLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const userData = await seedAdminUsers()
        setUsers(userData)
        setError(null)
      } catch (err) {
        console.error('Error loading users:', err)
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [isAuthenticated])

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        setError(null) // Clear any previous errors
        console.log('Creating user:', newUser)
        
        const user = await createUser(newUser)
        console.log('User created successfully:', user)
        
        setUsers(prev => [...prev, user])
        setNewUser({ name: '', email: '', role: 'viewer' })
        setShowAddUser(false)
        
        // Show success message temporarily
        setTimeout(() => {
          console.log(`Successfully added user: ${user.email}`)
        }, 100)
        
      } catch (err: any) {
        console.error('Error adding user:', err)
        
        let errorMessage = 'Failed to add user'
        if (err.message.includes('duplicate key') || err.message.includes('already exists')) {
          errorMessage = 'A user with this email already exists'
        } else if (err.message.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address'
        } else if (err.message.includes('permission')) {
          errorMessage = 'Permission denied. Unable to create user.'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
      }
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await updateUser(userId, updates)
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ))
      setEditingUser(null)
    } catch (err) {
      console.error('Error updating user:', err)
      setError('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId)
        setUsers(prev => prev.filter(user => user.id !== userId))
      } catch (err) {
        console.error('Error deleting user:', err)
        setError('Failed to delete user')
      }
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'editor': return <Edit2 className="h-4 w-4" />
      case 'viewer': return <Users className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleGuestAccess = () => {
    // Redirect guests to the main calendar page since admin panel requires admin privileges
    window.location.href = '/'
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUsers([])
  }

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} onGuestAccess={handleGuestAccess} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Calendar
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage users and permissions</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Users Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <button
                onClick={() => setShowAddUser(true)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.role === 'admin' && 'Full access, user management'}
                      {user.role === 'editor' && 'Create, edit, delete events'}
                      {user.role === 'viewer' && 'View events only'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {editingUser?.id === user.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateUser(user.id, editingUser)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                <h4 className="font-medium text-red-900">Administrator</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Full system access</li>
                <li>• Manage user accounts</li>
                <li>• Assign roles and permissions</li>
                <li>• Delete any event</li>
                <li>• Export data</li>
              </ul>
            </div>
            <div className="border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Edit2 className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-blue-900">Editor</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create new events</li>
                <li>• Edit existing events</li>
                <li>• Delete own events</li>
                <li>• Add comments</li>
                <li>• Export calendar</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="font-medium text-gray-900">Viewer</h4>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• View calendar events</li>
                <li>• Read event details</li>
                <li>• Add comments</li>
                <li>• Export calendar</li>
                <li>• No editing permissions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Creates a new user in both Supabase Auth and the users database table"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}