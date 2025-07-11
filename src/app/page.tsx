'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import Navigation from '@/components/Navigation'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <Navigation />
      
      {/* Sign In Section */}
      {!isAuthenticated && (
        <section className="py-8 bg-primary-50 border-b border-primary-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-light text-primary-800">
                  Sign in to access your account
                </h2>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="btn-primary"
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={() => handleAuthClick('register')}
                    className="btn-secondary"
                  >
                    Create account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Access Section */}
      <section className="minimal-section bg-primary-50">
        <div className="focus-area px-6">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-primary-800">
                Choose your plan
              </h2>
              <div className="w-8 h-px bg-primary-300 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="card p-8 text-center space-y-4">
                <h3 className="text-lg font-light text-primary-800">Essential</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-light text-primary-800">Free</div>
                  <div className="text-sm text-primary-600">Always</div>
                </div>
                <div className="space-y-2 text-sm text-primary-600">
                  <p>Core viewing guide</p>
                  <p>Seven day schedule</p>
                  <p>Programme reminders</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/guide'}
                  className="btn-secondary w-full"
                >
                  Begin
                </button>
              </div>
              
              <div className="card p-8 text-center space-y-4 ring-1 ring-primary-300">
                <h3 className="text-lg font-light text-primary-800">Complete</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-light text-primary-800">£3</div>
                  <div className="text-sm text-primary-600">Monthly</div>
                </div>
                <div className="space-y-2 text-sm text-primary-600">
                  <p>Full programme details</p>
                  <p>Extended schedule</p>
                  <p>Personal curation</p>
                </div>
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="btn-primary w-full"
                >
                  Try for free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-primary-100 border-t border-primary-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-base font-light text-primary-800 tracking-wide">digiguide.tv</span>
              </div>
              <p className="text-sm text-primary-600 font-light">
                Thoughtful television for mindful viewing.
              </p>
            </div>
            <div>
              <h4 className="font-light mb-4 text-primary-800">Information</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><a href="#" className="hover:text-primary-800 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-800 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary-800 transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light mb-4 text-primary-800">Support</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><a href="#" className="hover:text-primary-800 transition-colors">Help</a></li>
                <li><a href="#" className="hover:text-primary-800 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-200 mt-8 pt-8 text-center">
            <p className="text-sm text-primary-600 font-light">&copy; 2024 digiguide.tv. Made with intention.</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  )
}