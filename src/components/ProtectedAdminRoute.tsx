'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
}

export default function ProtectedAdminRoute({ children, requireSuperAdmin = false }: ProtectedAdminRouteProps) {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/')
        return
      }

      if (requireSuperAdmin && !isSuperAdmin()) {
        router.push('/')
        return
      }

      if (!requireSuperAdmin && !isAdmin()) {
        router.push('/')
        return
      }

      setIsChecking(false)
    }
  }, [isAuthenticated, isAdmin, isSuperAdmin, isLoading, router, requireSuperAdmin])

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized state if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to sign in to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  // Show insufficient permissions state
  if ((requireSuperAdmin && !isSuperAdmin()) || (!requireSuperAdmin && !isAdmin())) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Insufficient Permissions</h2>
          <p className="text-gray-600 mb-4">
            You don't have the required permissions to access this admin area.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  // Render the protected content
  return <>{children}</>
}