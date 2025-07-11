'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { authService, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>
  deleteAccount: () => Promise<AuthResponse>
  refreshToken: () => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize authentication state
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser()
        const token = authService.getToken()
        
        if (currentUser && token) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
      }
      return response
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.register(credentials)
      if (response.success && response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
      }
      return response
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<AuthResponse> => {
    const response = await authService.updateProfile(updates)
    if (response.success && response.user) {
      setUser(response.user)
    }
    return response
  }

  const deleteAccount = async (): Promise<AuthResponse> => {
    const response = await authService.deleteAccount()
    if (response.success) {
      setUser(null)
      setIsAuthenticated(false)
    }
    return response
  }

  const refreshToken = async (): Promise<AuthResponse> => {
    return await authService.refreshToken()
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext