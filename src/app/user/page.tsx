'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { User, Settings, Bell, Star, LogOut, Edit3, Shield, Download, Trash2, Crown, Calendar, Mail, CheckCircle } from 'lucide-react'

export default function UserPage() {
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(true)
  const [analyticsConsent, setAnalyticsConsent] = useState(true)

  const userInfo = {
    name: 'Premium User',
    email: 'user@example.com',
    platform: 'Freeview',
    memberSince: '2024',
    accountType: 'Premium',
    subscriptionEnd: '15th March 2025',
    country: 'United Kingdom',
    timezone: 'GMT+0',
    language: 'English (UK)'
  }

  const preferences = [
    { label: 'Preferred Platform', value: 'Freeview' },
    { label: 'Notification Settings', value: 'Email & Push' },
    { label: 'Favourite Genres', value: 'Drama, News, Documentary' },
    { label: 'Time Format', value: '24-hour' }
  ]

  const handleSignOut = () => {
    window.location.href = '/'
  }

  const handleNewsletterToggle = () => {
    setNewsletterSubscribed(!newsletterSubscribed)
  }

  const handleDataDownload = () => {
    // GDPR data export functionality would go here
    alert('Your data export will be prepared and sent to your email address within 30 days.')
  }

  const handleAccountDeletion = () => {
    // GDPR account deletion functionality would go here
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. Your account will be deleted within 30 days.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-12 py-32">
        
        {/* Header */}
        <div className="text-center space-y-16">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <User className="w-10 h-10 text-gray-700" />
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight">
              Profile
            </h1>
            <div className="w-px h-16 bg-gray-300 mx-auto"></div>
            <p className="text-xl font-light text-gray-600">
              Manage your account and viewing preferences
            </p>
          </div>
        </div>

        {/* Massive spacing */}
        <div className="py-24">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* User Information */}
        <div className="space-y-24">
          <div className="bg-white p-16 rounded-3xl border border-gray-100 
                        transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">
                  Account Information
                </h2>
                <button className="p-3 rounded-3xl hover:bg-gray-100 transition-all duration-300">
                  <Edit3 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Full Name</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Email Address</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Country</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Language</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.language}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Primary Platform</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Member Since</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.memberSince}</p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Timezone</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.timezone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="bg-white p-16 rounded-3xl border border-gray-100 
                        transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">
                  Subscription Details
                </h2>
                <div className="flex items-center space-x-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <span className="text-lg font-light text-gray-900">{userInfo.accountType}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Current Plan</p>
                    <p className="text-lg font-light text-gray-900">{userInfo.accountType} Plan</p>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Subscription Status</p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <p className="text-lg font-light text-green-600">Active</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Renewal Date</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <p className="text-lg font-light text-gray-900">{userInfo.subscriptionEnd}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-2">Billing</p>
                    <p className="text-lg font-light text-gray-900">£4.99/month</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-100">
                <button className="bg-gray-900 text-white px-8 py-4 rounded-3xl 
                                 text-lg font-light tracking-wide transition-all duration-500
                                 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1
                                 focus:outline-none focus:ring-4 focus:ring-gray-200">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white p-16 rounded-3xl border border-gray-100 
                        transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">
                  Viewing Preferences
                </h2>
                <button className="p-3 rounded-3xl hover:bg-gray-100 transition-all duration-300">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-8">
                {preferences.map((pref, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <p className="text-lg font-light text-gray-700">{pref.label}</p>
                    <p className="text-lg font-light text-gray-900">{pref.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy & Communication */}
          <div className="bg-white p-16 rounded-3xl border border-gray-100 
                        transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
            <div className="space-y-12">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light text-gray-900">
                  Privacy & Communications
                </h2>
              </div>
              
              <div className="space-y-8">
                {/* Newsletter Signup */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="space-y-2">
                    <p className="text-lg font-light text-gray-900">Newsletter Subscription</p>
                    <p className="text-sm font-light text-gray-600">Receive updates about new features and programme highlights</p>
                  </div>
                  <button
                    onClick={handleNewsletterToggle}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                      newsletterSubscribed ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                        newsletterSubscribed ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing Consent */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="space-y-2">
                    <p className="text-lg font-light text-gray-900">Marketing Communications</p>
                    <p className="text-sm font-light text-gray-600">Allow us to send you personalised programme recommendations</p>
                  </div>
                  <button
                    onClick={() => setMarketingConsent(!marketingConsent)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                      marketingConsent ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                        marketingConsent ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Analytics Consent */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="space-y-2">
                    <p className="text-lg font-light text-gray-900">Analytics & Performance</p>
                    <p className="text-sm font-light text-gray-600">Help us improve our service by analysing usage patterns</p>
                  </div>
                  <button
                    onClick={() => setAnalyticsConsent(!analyticsConsent)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                      analyticsConsent ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                        analyticsConsent ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* GDPR Data Rights */}
          <div className="bg-white p-16 rounded-3xl border border-gray-100 
                        transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
            <div className="space-y-12">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light text-gray-900">
                  Data Rights & Management
                </h2>
              </div>
              
              <div className="space-y-8">
                <p className="text-lg font-light text-gray-600">
                  Under GDPR, you have the right to access, modify, or delete your personal data. 
                  We are committed to protecting your privacy and giving you control over your information.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <button
                    onClick={handleDataDownload}
                    className="p-8 rounded-3xl border border-gray-200 hover:bg-gray-50 
                             transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="space-y-4">
                      <Download className="w-8 h-8 text-gray-700 mx-auto" />
                      <p className="text-lg font-light text-gray-900">Download My Data</p>
                      <p className="text-sm font-light text-gray-600">Export all your personal data</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleAccountDeletion}
                    className="p-8 rounded-3xl border border-red-200 hover:bg-red-50 
                             transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="space-y-4">
                      <Trash2 className="w-8 h-8 text-red-600 mx-auto" />
                      <p className="text-lg font-light text-red-600">Delete Account</p>
                      <p className="text-sm font-light text-gray-600">Permanently remove your account</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-16 rounded-3xl border border-gray-100 
                        transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
            <div className="space-y-12">
              <h2 className="text-2xl font-light text-gray-900">
                Quick Actions
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <button className="p-8 rounded-3xl border border-gray-200 hover:bg-gray-50 
                                 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <Bell className="w-8 h-8 text-gray-700 mx-auto" />
                    <p className="text-lg font-light text-gray-900">Notifications</p>
                  </div>
                </button>
                
                <button className="p-8 rounded-3xl border border-gray-200 hover:bg-gray-50 
                                 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <Star className="w-8 h-8 text-gray-700 mx-auto" />
                    <p className="text-lg font-light text-gray-900">Favourites</p>
                  </div>
                </button>
                
                <button className="p-8 rounded-3xl border border-gray-200 hover:bg-gray-50 
                                 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <Settings className="w-8 h-8 text-gray-700 mx-auto" />
                    <p className="text-lg font-light text-gray-900">Settings</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="py-32">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        <div className="text-center space-y-12">
          <button 
            onClick={handleSignOut}
            className="bg-white text-gray-900 px-16 py-6 rounded-3xl border border-gray-200 
                     text-lg font-light tracking-wide transition-all duration-500
                     hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2
                     focus:outline-none focus:ring-4 focus:ring-gray-200 flex items-center mx-auto"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>

        {/* Footer spacing */}
        <div className="py-24"></div>
      </div>
    </div>
  )
}