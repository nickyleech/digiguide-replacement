'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  
  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const handleSuccess = () => {
    onClose()
  }
  
  if (!isOpen) return null

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-50">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="w-full">
          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}