'use client'

import React, { useState } from 'react'
import { Tv, HelpCircle, User, LogOut, Bookmark, Bell, Search, Settings } from 'lucide-react'
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
      <nav className="bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-12 py-12">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-light text-black tracking-wide">
                digiguide.tv
              </span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-16">
              <button
                onClick={() => handleNavigation('/guide')}
                className={`text-xl font-light transition-colors ${
                  currentPage === 'guide' 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Guide
              </button>
              
              <button
                onClick={() => handleNavigation('/search')}
                className={`text-xl font-light transition-colors ${
                  currentPage === 'search' 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Search
              </button>
              
              <button
                onClick={() => handleNavigation('/help')}
                className={`text-xl font-light transition-colors ${
                  currentPage === 'help' 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Help
              </button>
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/watchlist')}
                    className={`text-xl font-light transition-colors ${
                      currentPage === 'watchlist' 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Watchlist
                  </button>
                  <button
                    onClick={() => handleNavigation('/reminders')}
                    className={`text-xl font-light transition-colors ${
                      currentPage === 'reminders' 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Reminders
                  </button>
                  <button
                    onClick={() => handleNavigation('/user')}
                    className={`text-xl font-light transition-colors ${
                      currentPage === 'user' 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigation('/preferences')}
                    className={`text-xl font-light transition-colors ${
                      currentPage === 'preferences' 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Preferences
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xl font-light text-gray-400 hover:text-black transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-xl font-light text-gray-400 hover:text-black transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="text-xl font-light bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors"
                  >
                    Sign up
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