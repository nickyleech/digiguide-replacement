import { User } from '@/types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  token?: string
}

// Mock auth service - in production this would connect to a real backend
export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null
  private token: string | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    // Check for stored authentication on initialization
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('digiguide_user')
        const storedToken = localStorage.getItem('digiguide_token')
        
        if (storedUser && storedToken) {
          this.currentUser = JSON.parse(storedUser)
          this.token = storedToken
          console.log('Auth: Loaded user from storage:', this.currentUser?.email)
        } else {
          console.log('Auth: No stored authentication found')
        }
      } catch (error) {
        console.error('Auth: Error loading from storage:', error)
        this.clearStorage()
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        if (this.currentUser && this.token) {
          localStorage.setItem('digiguide_user', JSON.stringify(this.currentUser))
          localStorage.setItem('digiguide_token', this.token)
          console.log('Auth: Saved user to storage:', this.currentUser.email)
        } else {
          this.clearStorage()
        }
      } catch (error) {
        console.error('Auth: Error saving to storage:', error)
      }
    }
  }

  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('digiguide_user')
      localStorage.removeItem('digiguide_token')
      console.log('Auth: Cleared storage')
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Auth: Attempting login for:', credentials.email)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (!credentials.email || !credentials.password) {
        console.log('Auth: Missing email or password')
        return { success: false, error: 'Email and password are required' }
      }

      // Check for super admin login
      if (credentials.email === 'admin@digiguide.tv' && credentials.password === 'admin123') {
        const user: User = {
          id: 'super-admin-1',
          email: credentials.email,
          subscriptionTier: 'premium',
          platformPreference: 'freeview',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        const token = 'mock-jwt-token-admin-' + Date.now()
        
        this.currentUser = user
        this.token = token
        this.saveToStorage()

        console.log('Auth: Admin login successful')
        return { success: true, user, token }
      }
      
      // Check for regular demo user login
      if (credentials.email === 'demo@digiguide.tv' && credentials.password === 'demo123') {
        const user: User = {
          id: 'demo-user-1',
          email: credentials.email,
          subscriptionTier: 'premium',
          platformPreference: 'freeview',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        const token = 'mock-jwt-token-' + Date.now()
        
        this.currentUser = user
        this.token = token
        this.saveToStorage()

        console.log('Auth: Demo user login successful')
        return { success: true, user, token }
      } else {
        console.log('Auth: Invalid credentials provided')
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Auth: Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
        return { success: false, error: 'All fields are required' }
      }

      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, error: 'Passwords do not match' }
      }

      if (credentials.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }

      // Mock successful registration
      const user: User = {
        id: 'user-' + Date.now(),
        email: credentials.email,
        subscriptionTier: 'free',
        platformPreference: 'freeview',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const token = 'mock-jwt-token-' + Date.now()
      
      this.currentUser = user
      this.token = token
      this.saveToStorage()

      return { success: true, user, token }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  async logout(): Promise<void> {
    console.log('Auth: Logging out user:', this.currentUser?.email)
    this.currentUser = null
    this.token = null
    this.saveToStorage()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.role === 'super_admin'
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === 'super_admin'
  }

  hasRole(role: 'user' | 'admin' | 'super_admin'): boolean {
    if (!this.currentUser) return false
    
    switch (role) {
      case 'user':
        return true // All authenticated users are users
      case 'admin':
        return this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin'
      case 'super_admin':
        return this.currentUser.role === 'super_admin'
      default:
        return false
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!this.token) {
        return { success: false, error: 'No token to refresh' }
      }

      // Mock token refresh
      const newToken = 'mock-jwt-token-' + Date.now()
      this.token = newToken
      this.saveToStorage()

      return { success: true, token: newToken }
    } catch (error) {
      return { success: false, error: 'Token refresh failed' }
    }
  }

  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!this.currentUser) {
        return { success: false, error: 'Not authenticated' }
      }

      // Mock profile update
      const updatedUser: User = {
        ...this.currentUser,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      this.currentUser = updatedUser
      this.saveToStorage()

      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, error: 'Profile update failed' }
    }
  }

  async deleteAccount(): Promise<AuthResponse> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!this.currentUser) {
        return { success: false, error: 'Not authenticated' }
      }

      // Mock account deletion
      await this.logout()

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Account deletion failed' }
    }
  }
}

export const authService = AuthService.getInstance()