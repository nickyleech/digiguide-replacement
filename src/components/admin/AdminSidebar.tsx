'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard,
  Users,
  Tv,
  CreditCard,
  Settings,
  BarChart3,
  Shield,
  HelpCircle,
  LogOut,
  ChevronDown,
  Database,
  Radio,
  Building2
} from 'lucide-react'

interface AdminSidebarProps {
  currentPage: string
}

export default function AdminSidebar({ currentPage }: AdminSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['users', 'channels', 'corporate'])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      active: currentPage === 'dashboard'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      expandable: true,
      expanded: expandedMenus.includes('users'),
      children: [
        { label: 'All Users', href: '/admin/users', active: currentPage === 'users' },
        { label: 'Subscribers', href: '/admin/users/subscribers', active: currentPage === 'subscribers' },
        { label: 'Admin Users', href: '/admin/users/admins', active: currentPage === 'admin-users' }
      ]
    },
    {
      id: 'channels',
      label: 'Channel Management',
      icon: Tv,
      expandable: true,
      expanded: expandedMenus.includes('channels'),
      children: [
        { label: 'All Channels', href: '/admin/channels', active: currentPage === 'channels' },
        { label: 'Channel Mapping', href: '/admin/channels/mapping', active: currentPage === 'channel-mapping' },
        { label: 'Logos & Assets', href: '/admin/channels/assets', active: currentPage === 'channel-assets' }
      ]
    },
    {
      id: 'platforms',
      label: 'Platform Management',
      icon: Radio,
      expandable: true,
      expanded: expandedMenus.includes('platforms'),
      children: [
        { label: 'All Platforms', href: '/admin/platforms', active: currentPage === 'platforms' },
        { label: 'EPG Numbers', href: '/admin/platforms/epg', active: currentPage === 'epg-numbers' },
        { label: 'Platform Settings', href: '/admin/platforms/settings', active: currentPage === 'platform-settings' }
      ]
    },
    {
      id: 'corporate',
      label: 'Corporate Accounts',
      icon: Building2,
      expandable: true,
      expanded: expandedMenus.includes('corporate'),
      children: [
        { label: 'All Corporate Accounts', href: '/admin/corporate/accounts', active: currentPage === 'corporate-accounts' },
        { label: 'Corporate Users', href: '/admin/corporate/users', active: currentPage === 'corporate-users' },
        { label: 'Account Settings', href: '/admin/corporate/settings', active: currentPage === 'corporate-settings' }
      ]
    },
    {
      id: 'billing',
      label: 'Billing & Payments',
      icon: CreditCard,
      expandable: true,
      expanded: expandedMenus.includes('billing'),
      children: [
        { label: 'Subscriptions', href: '/admin/billing/subscriptions', active: currentPage === 'subscriptions' },
        { label: 'Payments', href: '/admin/billing/payments', active: currentPage === 'payments' },
        { label: 'Refunds', href: '/admin/billing/refunds', active: currentPage === 'refunds' },
        { label: 'Offer Codes', href: '/admin/billing/offer-codes', active: currentPage === 'offer-codes' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      active: currentPage === 'analytics'
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: Settings,
      expandable: true,
      expanded: expandedMenus.includes('system'),
      children: [
        { label: 'General Settings', href: '/admin/system/general', active: currentPage === 'general-settings' },
        { label: 'API Management', href: '/admin/system/api', active: currentPage === 'api-management' },
        { label: 'Audit Logs', href: '/admin/system/logs', active: currentPage === 'audit-logs' }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      href: '/admin/security',
      active: currentPage === 'security'
    }
  ]

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400">TV Guide Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.expandable ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                      item.children?.some(child => child.active) ? 'bg-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      item.expanded ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {item.expanded && (
                    <div className="bg-gray-800">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-12 py-2 text-sm hover:bg-gray-700 transition-colors ${
                            child.active ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition-colors ${
                    item.active ? 'bg-gray-800 text-blue-400' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800 space-y-2">
        <Link
          href="/admin/help"
          className="flex items-center space-x-3 px-2 py-2 hover:bg-gray-800 rounded transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm">Help & Support</span>
        </Link>
        <button className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-gray-800 rounded transition-colors text-left">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  )
}