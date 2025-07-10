'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  Tv, 
  Smartphone, 
  Calendar, 
  Bell, 
  Star, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const [selectedPlatform, setSelectedPlatform] = useState('freeview')

  const platforms = [
    { id: 'freeview', name: 'Freeview', logo: '📺' },
    { id: 'sky', name: 'Sky', logo: '🛰️' },
    { id: 'virgin', name: 'Virgin Media', logo: '📡' },
    { id: 'freesat', name: 'Freesat', logo: '🎯' },
  ]

  const features = [
    {
      icon: <Tv className="w-8 h-8" />,
      title: 'Multi-Platform Support',
      description: 'Works seamlessly with Sky, Freeview, Virgin Media, and Freesat. All your favourite channels in one place.',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile-First Design',
      description: 'Stunning interface optimised for mobile, tablet, and desktop. Never miss a programme on the go.',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: '10-Day Programme Guide',
      description: 'Plan your viewing up to 10 days in advance with our comprehensive programme listings.',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Smart Reminders',
      description: 'Get notified about your favourite shows via email or push notifications.',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Personalised Experience',
      description: 'Customise your guide with favourite channels, genres, and personalised recommendations.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Premium Analytics',
      description: 'Advanced insights into your viewing habits and programme popularity trends.',
    },
  ]

  const pricingTiers = [
    {
      name: 'Free',
      price: '£0',
      period: 'forever',
      features: [
        '3 popular channels',
        '7-day programme guide',
        'Basic programme information',
        'Mobile-responsive interface',
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Premium',
      price: '£4.99',
      period: 'per month',
      features: [
        'All UK channels',
        '10-day programme guide',
        'Programme reminders',
        'Personalised recommendations',
        'Advanced search & filtering',
        'Premium analytics',
        'Priority support',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary' as const,
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-20 px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="gradient-bg p-2 rounded-xl">
                <Tv className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-secondary-900">digiguide.tv</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm" onClick={() => window.location.href = '/guide'}>View Guide</Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-secondary-900 mb-6">
                The Future of
                <span className="block gradient-bg bg-clip-text text-transparent">
                  TV Listings
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto">
                Experience the most beautiful and comprehensive TV guide for UK television. 
                Never miss your favourite programmes again.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href = '/guide'}>
                  View TV Guide
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Platform Selector */}
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-secondary-600 mb-4">Works with all major UK TV platforms</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        selectedPlatform === platform.id
                          ? 'bg-primary-600 text-white shadow-lg scale-105'
                          : 'bg-white text-secondary-700 hover:bg-secondary-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{platform.logo}</div>
                      <div className="text-sm font-medium">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Discover why digiguide.tv is the premium choice for UK TV enthusiasts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center group hover:scale-105 transition-transform duration-200">
                <div className="gradient-bg w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Choose the plan that works best for you. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`card p-8 ${tier.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
                {tier.popular && (
                  <div className="gradient-bg text-white text-sm font-semibold px-3 py-1 rounded-full text-center mb-4">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-secondary-900">{tier.price}</span>
                    <span className="text-secondary-600 ml-2">/{tier.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={tier.buttonVariant} 
                  className="w-full"
                  size="lg"
                >
                  {tier.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your TV Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of UK viewers who have already discovered the future of television listings.
          </p>
          <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="gradient-bg p-2 rounded-xl">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">digiguide.tv</span>
              </div>
              <p className="text-secondary-400">
                The most comprehensive TV guide for UK television.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 digiguide.tv. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}