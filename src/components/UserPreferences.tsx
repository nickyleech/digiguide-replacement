'use client'

import { useState } from 'react'

interface UserPreferencesProps {
  onSave?: (preferences: any) => void
  onReset?: () => void
}

export default function UserPreferences({ onSave, onReset }: UserPreferencesProps) {
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('24')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reminderAdvanceTime, setReminderAdvanceTime] = useState(15)
  const [parentalControlsEnabled, setParentalControlsEnabled] = useState(false)
  const [parentalPin, setParentalPin] = useState('')
  const [allowedRatings, setAllowedRatings] = useState<string[]>(['U', 'PG', '12', '15', '18'])
  const [language, setLanguage] = useState('en-GB')
  const [region, setRegion] = useState('UK')
  const [timezone, setTimezone] = useState('Europe/London')
  const [dataCollection, setDataCollection] = useState(true)
  const [personalisation, setPersonalisation] = useState(true)
  const [thirdPartySharing, setThirdPartySharing] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(true)

  const handleSave = () => {
    const preferences = {
      viewing: { timeFormat },
      notifications: { email: emailNotifications, push: pushNotifications, advanceTime: reminderAdvanceTime },
      parental: { enabled: parentalControlsEnabled, pin: parentalPin, allowedRatings },
      locale: { language, region, timezone },
      privacy: { dataCollection, personalisation, thirdPartySharing, marketingEmails }
    }
    onSave?.(preferences)
  }

  const handleReset = () => {
    setTimeFormat('24')
    setEmailNotifications(true)
    setPushNotifications(true)
    setReminderAdvanceTime(15)
    setParentalControlsEnabled(false)
    setParentalPin('')
    setAllowedRatings(['U', 'PG', '12', '15', '18'])
    setLanguage('en-GB')
    setRegion('UK')
    setTimezone('Europe/London')
    setDataCollection(true)
    setPersonalisation(true)
    setThirdPartySharing(false)
    setMarketingEmails(true)
    onReset?.()
  }

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full border transition-colors ${
        enabled ? 'bg-black' : 'bg-white border-black'
      }`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="py-32">
        <h1 className="text-7xl font-light text-black mb-32 text-center">
          Preferences
        </h1>
        
        <div className="space-y-32">
          {/* Time Format */}
          <div className="space-y-8">
            <p className="text-2xl font-light text-black">Time Format</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setTimeFormat('12')}
                className={`px-8 py-4 border transition-colors ${
                  timeFormat === '12' ? 'bg-black text-white' : 'bg-white text-black border-black'
                }`}
              >
                12-hour
              </button>
              <button
                onClick={() => setTimeFormat('24')}
                className={`px-8 py-4 border transition-colors ${
                  timeFormat === '24' ? 'bg-black text-white' : 'bg-white text-black border-black'
                }`}
              >
                24-hour
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-8">
            <p className="text-2xl font-light text-black">Notifications</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Email</span>
                <Toggle enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Push</span>
                <Toggle enabled={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} />
              </div>
              <div className="space-y-4">
                <span className="text-lg font-light text-black">Advance Time</span>
                <select 
                  value={reminderAdvanceTime}
                  onChange={(e) => setReminderAdvanceTime(Number(e.target.value))}
                  className="w-full p-4 border border-black bg-white text-black"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parental Controls */}
          <div className="space-y-8">
            <p className="text-2xl font-light text-black">Parental Controls</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Enable</span>
                <Toggle enabled={parentalControlsEnabled} onToggle={() => setParentalControlsEnabled(!parentalControlsEnabled)} />
              </div>
              
              {parentalControlsEnabled && (
                <div className="space-y-6 pl-8 border-l-2 border-black">
                  <div>
                    <span className="text-lg font-light text-black block mb-4">PIN</span>
                    <input
                      type="password"
                      value={parentalPin}
                      onChange={(e) => setParentalPin(e.target.value)}
                      className="w-full p-4 border border-black bg-white text-black"
                      placeholder="Enter 4-digit PIN"
                      maxLength={4}
                    />
                  </div>
                  
                  <div>
                    <span className="text-lg font-light text-black block mb-4">Allowed Ratings</span>
                    <div className="flex space-x-2">
                      {['U', 'PG', '12', '15', '18'].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => {
                            setAllowedRatings(prev => 
                              prev.includes(rating) 
                                ? prev.filter(r => r !== rating)
                                : [...prev, rating]
                            )
                          }}
                          className={`w-12 h-12 border transition-colors ${
                            allowedRatings.includes(rating)
                              ? 'bg-black text-white'
                              : 'bg-white text-black border-black'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language & Region */}
          <div className="space-y-8">
            <p className="text-2xl font-light text-black">Language & Region</p>
            <div className="space-y-6">
              <div>
                <span className="text-lg font-light text-black block mb-4">Language</span>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-4 border border-black bg-white text-black"
                >
                  <option value="en-GB">English (UK)</option>
                  <option value="en-US">English (US)</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div>
                <span className="text-lg font-light text-black block mb-4">Region</span>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-4 border border-black bg-white text-black"
                >
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <div>
                <span className="text-lg font-light text-black block mb-4">Timezone</span>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-4 border border-black bg-white text-black"
                >
                  <option value="Europe/London">GMT (London)</option>
                  <option value="America/New_York">EST (New York)</option>
                  <option value="America/Los_Angeles">PST (Los Angeles)</option>
                  <option value="Australia/Sydney">AEST (Sydney)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-8">
            <p className="text-2xl font-light text-black">Privacy</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Data Collection</span>
                <Toggle enabled={dataCollection} onToggle={() => setDataCollection(!dataCollection)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Personalisation</span>
                <Toggle enabled={personalisation} onToggle={() => setPersonalisation(!personalisation)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Third Party Sharing</span>
                <Toggle enabled={thirdPartySharing} onToggle={() => setThirdPartySharing(!thirdPartySharing)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-black">Marketing Emails</span>
                <Toggle enabled={marketingEmails} onToggle={() => setMarketingEmails(!marketingEmails)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-32">
          <button
            onClick={handleReset}
            className="px-8 py-4 border border-black bg-white text-black text-lg font-light transition-colors hover:bg-black hover:text-white"
          >
            Reset
          </button>
          
          <button
            onClick={handleSave}
            className="px-12 py-4 bg-black text-white text-lg font-light transition-colors hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}