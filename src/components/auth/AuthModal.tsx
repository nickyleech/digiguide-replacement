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
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9998]"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8 z-[9999]">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              {mode === 'login' ? (
                <LoginForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
              ) : (
                <RegisterForm onToggleMode={toggleMode} onSuccess={handleSuccess} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}