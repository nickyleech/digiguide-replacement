'use client'

import Navigation from '@/components/Navigation'
import { Search, Tv, Calendar, User, HelpCircle } from 'lucide-react'

export default function HelpPage() {
  const helpSections = [
    {
      title: 'Getting Started',
      content: 'Welcome to digiguide.tv. Simply sign in and begin exploring our comprehensive television guide. Navigate between dates and platforms to find your preferred programmes.',
      icon: <Tv className="w-6 h-6" />
    },
    {
      title: 'Searching Programmes',
      content: 'Use the search function to find specific programmes, actors, or genres. Our intelligent search will help you discover content across all supported platforms.',
      icon: <Search className="w-6 h-6" />
    },
    {
      title: 'Date Navigation',
      content: 'Browse programmes up to 14 days in advance. Use the date selector to plan your viewing schedule and never miss your favourite shows.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      title: 'Platform Selection',
      content: 'Switch between Freeview, Sky, Virgin Media, and Freesat to see programmes specific to your television service provider.',
      icon: <User className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-12 py-32">
        
        {/* Header */}
        <div className="text-center space-y-16">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <HelpCircle className="w-10 h-10 text-gray-700" />
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight">
              Help Centre
            </h1>
            <div className="w-px h-16 bg-gray-300 mx-auto"></div>
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about using your premium television guide
            </p>
          </div>
        </div>

        {/* Massive spacing */}
        <div className="py-24">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Help Sections */}
        <div className="space-y-24">
          {helpSections.map((section, index) => (
            <div key={index} className="space-y-8">
              <div className="bg-white p-16 rounded-3xl border border-gray-100 
                            transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30">
                <div className="space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-light text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-lg font-light text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="py-32">
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        <div className="text-center space-y-12">
          <h2 className="text-3xl font-light text-gray-900">
            Need Additional Support?
          </h2>
          <p className="text-lg font-light text-gray-600">
            Our support team is available to assist with any questions
          </p>
          <button className="bg-white text-gray-900 px-16 py-6 rounded-3xl border border-gray-200 
                           text-lg font-light tracking-wide transition-all duration-500
                           hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2
                           focus:outline-none focus:ring-4 focus:ring-gray-200">
            Contact Support
          </button>
        </div>

        {/* Footer spacing */}
        <div className="py-24"></div>
      </div>
    </div>
  )
}