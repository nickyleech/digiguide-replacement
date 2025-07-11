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
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  hasRole: (role: 'user' | 'admin' | 'super_admin') => boolean
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
          console.log('AuthContext: Initialized with user:', currentUser.email)
        } else {
          console.log('AuthContext: No authenticated user found')
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
        console.log('AuthContext: Login successful for:', response.user.email)
      } else {
        console.log('AuthContext: Login failed:', response.error)
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
      console.log('AuthContext: Logout successful')
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

  const isAdmin = (): boolean => {
    return authService.isAdmin()
  }

  const isSuperAdmin = (): boolean => {
    return authService.isSuperAdmin()
  }

  const hasRole = (role: 'user' | 'admin' | 'super_admin'): boolean => {
    return authService.hasRole(role)
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
    refreshToken,
    isAdmin,
    isSuperAdmin,
    hasRole
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