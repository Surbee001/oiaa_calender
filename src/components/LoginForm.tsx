'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'
import { Mail, Loader2 } from 'lucide-react'

interface LoginFormProps {
  onLoginSuccess: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Check if the email exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, role')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (userError || !userData) {
        throw new Error('Access denied. Please contact your administrator.')
      }

      // Send magic link for authentication
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      })

      if (authError) {
        throw authError
      }

      setMessage('Check your email for a login link!')
      
      // For demo purposes, simulate successful login after showing the message
      // In production, users would need to click the magic link from their email
      setTimeout(() => {
        // Simulate successful authentication
        onLoginSuccess()
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            OIAA Admin Login
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your authorized email address to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@ajman.ac.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Only authorized OIAA email addresses can access the admin panel
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email.trim()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need access? Contact your system administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}