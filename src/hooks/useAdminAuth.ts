'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    if (!isAdmin()) {
      router.push('/')
      return
    }
  }, [isAuthenticated, isAdmin, router])

  return {
    user,
    isAuthenticated,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    hasRole,
    canAccessAdmin: isAuthenticated && isAdmin()
  }
}

export function useRequireAdmin() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.push('/')
    }
  }, [isAuthenticated, isAdmin, router])

  return isAuthenticated && isAdmin()
}

export function useRequireSuperAdmin() {
  const { isAuthenticated, isSuperAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !isSuperAdmin()) {
      router.push('/')
    }
  }, [isAuthenticated, isSuperAdmin, router])

  return isAuthenticated && isSuperAdmin()
}