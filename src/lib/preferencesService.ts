import { UserPreferences } from '@/types'

const PREFERENCES_KEY = 'user_preferences'

// Default preferences
const defaultPreferences: UserPreferences = {
  channels: {
    order: [],
    hidden: [],
    favourites: ['BBC One', 'ITV', 'Channel 4']
  },
  viewing: {
    timeFormat: '24',
    theme: 'light',
    gridLayout: 'comfortable',
    autoRefresh: true,
    showNowPlaying: true
  },
  notifications: {
    email: true,
    push: true,
    advanceTime: 15,
    suggestions: true
  },
  parental: {
    enabled: false,
    pin: '',
    allowedRatings: ['U', 'PG', '12', '15', '18'],
    restrictedGenres: []
  },
  locale: {
    language: 'en-GB',
    region: 'UK',
    timezone: 'Europe/London'
  },
  privacy: {
    dataCollection: true,
    personalisation: true,
    thirdPartySharing: false,
    marketingEmails: true
  },
  quickActions: {
    showWatchlist: true,
    showReminders: true,
    showSearch: true,
    showChannelGuide: true
  }
}

export class PreferencesService {
  /**
   * Load user preferences from localStorage
   */
  static loadPreferences(): UserPreferences {
    if (typeof window === 'undefined') {
      return defaultPreferences
    }

    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all fields are present
        return this.mergeWithDefaults(parsed)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }

    return defaultPreferences
  }

  /**
   * Save user preferences to localStorage
   */
  static savePreferences(preferences: UserPreferences): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('preferencesChanged', { 
        detail: preferences 
      }))
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  /**
   * Reset preferences to defaults
   */
  static resetPreferences(): UserPreferences {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PREFERENCES_KEY)
    }
    return defaultPreferences
  }

  /**
   * Export preferences as JSON file
   */
  static exportPreferences(): void {
    const preferences = this.loadPreferences()
    const dataStr = JSON.stringify(preferences, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'digiguide-preferences.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  /**
   * Import preferences from JSON file
   */
  static importPreferences(file: File): Promise<UserPreferences> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const imported = JSON.parse(content)
          const merged = this.mergeWithDefaults(imported)
          
          this.savePreferences(merged)
          resolve(merged)
        } catch (error) {
          reject(new Error('Invalid preferences file format'))
        }
      }
      
      reader.onerror = () => reject(new Error('Error reading file'))
      reader.readAsText(file)
    })
  }

  /**
   * Get specific preference value
   */
  static getPreference<T>(path: string, defaultValue?: T): T {
    const preferences = this.loadPreferences()
    return this.getNestedValue(preferences, path, defaultValue)
  }

  /**
   * Update specific preference value
   */
  static updatePreference(path: string, value: any): void {
    const preferences = this.loadPreferences()
    this.setNestedValue(preferences, path, value)
    this.savePreferences(preferences)
  }

  /**
   * Check if parental controls are enabled and PIN is required
   */
  static requiresParentalPin(): boolean {
    const preferences = this.loadPreferences()
    return preferences.parental.enabled && preferences.parental.pin.length > 0
  }

  /**
   * Verify parental control PIN
   */
  static verifyParentalPin(pin: string): boolean {
    const preferences = this.loadPreferences()
    return preferences.parental.pin === pin
  }

  /**
   * Check if content is allowed based on parental controls
   */
  static isContentAllowed(rating: string, genre: string): boolean {
    const preferences = this.loadPreferences()
    
    if (!preferences.parental.enabled) {
      return true
    }
    
    // Check rating
    if (!preferences.parental.allowedRatings.includes(rating)) {
      return false
    }
    
    // Check genre restrictions
    if (preferences.parental.restrictedGenres.includes(genre)) {
      return false
    }
    
    return true
  }

  /**
   * Get channels in display order
   */
  static getChannelsInOrder(channels: any[]): any[] {
    const preferences = this.loadPreferences()
    const { order, hidden } = preferences.channels
    
    // Filter out hidden channels
    const visibleChannels = channels.filter(channel => !hidden.includes(channel.id))
    
    // If no custom order, return as-is
    if (order.length === 0) {
      return visibleChannels
    }
    
    // Sort by custom order
    return visibleChannels.sort((a, b) => {
      const indexA = order.indexOf(a.id)
      const indexB = order.indexOf(b.id)
      
      // If both are in order, sort by order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      
      // If only A is in order, A comes first
      if (indexA !== -1) return -1
      
      // If only B is in order, B comes first
      if (indexB !== -1) return 1
      
      // If neither is in order, maintain original order
      return 0
    })
  }

  /**
   * Subscribe to preference changes
   */
  static onPreferencesChange(callback: (preferences: UserPreferences) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail)
    }
    
    window.addEventListener('preferencesChanged', handler as EventListener)
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('preferencesChanged', handler as EventListener)
    }
  }

  /**
   * Apply theme to document
   */
  static applyTheme(): void {
    const preferences = this.loadPreferences()
    const { theme } = preferences.viewing
    
    if (theme === 'auto') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', systemPrefersDark)
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }

  // Private helper methods
  private static mergeWithDefaults(preferences: any): UserPreferences {
    const merged = { ...defaultPreferences }
    
    // Deep merge preferences
    Object.keys(preferences).forEach(key => {
      if (typeof preferences[key] === 'object' && !Array.isArray(preferences[key])) {
        merged[key as keyof UserPreferences] = {
          ...merged[key as keyof UserPreferences],
          ...preferences[key]
        }
      } else {
        merged[key as keyof UserPreferences] = preferences[key]
      }
    })
    
    return merged
  }

  private static getNestedValue(obj: any, path: string, defaultValue?: any): any {
    const keys = path.split('.')
    let current = obj
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue
      }
      current = current[key]
    }
    
    return current
  }

  private static setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.')
    let current = obj
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[keys[keys.length - 1]] = value
  }
}

export default PreferencesService