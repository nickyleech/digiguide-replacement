'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface LoginFormProps {
  onToggleMode: () => void
  onSuccess?: () => void
}

export default function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('LoginForm: Attempting login with:', email)
      const response = await login({ email, password })
      if (response.success) {
        console.log('LoginForm: Login successful, closing modal')
        onSuccess?.()
      } else {
        console.log('LoginForm: Login failed:', response.error)
        setError(response.error || 'Login failed')
      }
    } catch (error) {
      console.error('LoginForm: Unexpected error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-500 font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-700 mb-2">
          <strong>Demo Accounts:</strong>
        </p>
        <div className="text-sm text-blue-600 space-y-2">
          <div>
            <strong>Regular User:</strong><br />
            Email: demo@digiguide.tv<br />
            Password: demo123
            <button
              type="button"
              onClick={() => {
                setEmail('demo@digiguide.tv')
                setPassword('demo123')
              }}
              className="ml-2 text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
            >
              Use this
            </button>
          </div>
          <div>
            <strong>Admin User:</strong><br />
            Email: admin@digiguide.tv<br />
            Password: admin123
            <button
              type="button"
              onClick={() => {
                setEmail('admin@digiguide.tv')
                setPassword('admin123')
              }}
              className="ml-2 text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
            >
              Use this
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}