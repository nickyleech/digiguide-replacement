'use client'

import React, { useState } from 'react'
import { Tv, HelpCircle, User, LogOut, Bookmark } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './auth/AuthModal'

interface MinimalistNavigationProps {
  currentPage?: string
}

export default function MinimalistNavigation({ currentPage = 'guide' }: MinimalistNavigationProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-12 py-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Tv className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-xl font-light text-gray-900 tracking-wide">
                digiguide.tv
              </span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-12">
              <button
                onClick={() => handleNavigation('/guide')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 ${
                  currentPage === 'guide' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Tv className="w-5 h-5" />
                <span className="font-light">Guide</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/help')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 ${
                  currentPage === 'help' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-light">Help</span>
              </button>
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/watchlist')}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 ${
                      currentPage === 'watchlist' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark className="w-5 h-5" />
                    <span className="font-light">Watchlist</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/user')}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 ${
                      currentPage === 'user' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-light">Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-light">Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <span className="font-light">Sign in</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="flex items-center space-x-3 px-6 py-3 rounded-3xl transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    <span className="font-light">Sign up</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}