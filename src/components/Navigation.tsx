'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, Home, Search, User, Settings, Heart, Bell, HelpCircle, Shield } from 'lucide-react'

export default function Navigation() {
  const { isAuthenticated, isAdmin } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/guide', label: 'Guide', icon: Search },
    ...(isAuthenticated ? [
      { href: '/user', label: 'Profile', icon: User },
      { href: '/watchlist', label: 'Watchlist', icon: Heart },
      { href: '/reminders', label: 'Reminders', icon: Bell },
      { href: '/preferences', label: 'Preferences', icon: Settings },
    ] : []),
    ...(isAuthenticated && isAdmin() ? [
      { href: '/admin', label: 'Admin', icon: Shield },
    ] : []),
    { href: '/help', label: 'Help', icon: HelpCircle },
  ]

  return (
    <nav className="px-6 py-4 bg-primary-50 border-b border-primary-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-light text-primary-800 tracking-wide">digiguide.tv</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-primary-600 hover:text-primary-800 font-light text-sm tracking-wide transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-primary-600 hover:text-primary-800"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-primary-600 hover:text-primary-800 font-light text-sm tracking-wide transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}