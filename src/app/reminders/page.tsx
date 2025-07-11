'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Mail, Smartphone, Clock, Save, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reminderService } from '@/lib/reminderService';
import { ReminderPreferences, NotificationMethod, NOTIFICATION_TIMINGS } from '@/lib/reminders';
import RemindersList from '@/components/RemindersList';

export default function RemindersPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ReminderPreferences | null>(null);
  const [savedMessage, setSavedMessage] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  useEffect(() => {
    if (user) {
      const userPrefs = reminderService.getUserPreferences(user.id);
      setPreferences(userPrefs);
      
      // Check notification permission
      if ('Notification' in window) {
        setHasNotificationPermission(Notification.permission === 'granted');
      }
    }
  }, [user]);

  const updatePreferences = (updates: Partial<ReminderPreferences>) => {
    if (!user || !preferences) return;

    const newPreferences = { ...preferences, ...updates };
    reminderService.updateUserPreferences(user.id, updates);
    setPreferences(newPreferences);
    
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const updateNotificationMethod = (index: number, updates: Partial<NotificationMethod>) => {
    if (!preferences) return;

    const newMethods = [...preferences.defaultNotificationMethods];
    newMethods[index] = { ...newMethods[index], ...updates };
    
    updatePreferences({ defaultNotificationMethods: newMethods });
  };

  const addNotificationMethod = (type: 'email' | 'push' | 'sms') => {
    if (!preferences) return;

    const newMethod: NotificationMethod = {
      type,
      enabled: true,
      timing: 15
    };

    updatePreferences({
      defaultNotificationMethods: [...preferences.defaultNotificationMethods, newMethod]
    });
  };

  const removeNotificationMethod = (index: number) => {
    if (!preferences) return;

    const newMethods = preferences.defaultNotificationMethods.filter((_, i) => i !== index);
    updatePreferences({ defaultNotificationMethods: newMethods });
  };

  const requestNotificationPermission = async () => {
    const granted = await reminderService.requestNotificationPermission();
    setHasNotificationPermission(granted);
    
    if (granted) {
      updatePreferences({ pushNotificationsEnabled: true });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to manage reminders</h2>
          <p className="text-gray-600">Create an account to set up programme reminders and notifications</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders & Notifications</h1>
          <p className="text-gray-600">Manage your programme reminders and notification preferences</p>
        </div>

        {savedMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Preferences saved successfully!</span>
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Settings
            </h2>

            <div className="space-y-6">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Browser Push Notifications</h3>
                    <p className="text-sm text-gray-600">
                      {hasNotificationPermission 
                        ? 'Receive notifications directly in your browser' 
                        : 'Enable browser notifications to receive reminders'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!hasNotificationPermission && (
                    <button
                      onClick={requestNotificationPermission}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Enable
                    </button>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.pushNotificationsEnabled && hasNotificationPermission}
                      onChange={(e) => updatePreferences({ pushNotificationsEnabled: e.target.checked })}
                      disabled={!hasNotificationPermission}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive reminder emails at {user.email}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotificationsEnabled}
                    onChange={(e) => updatePreferences({ emailNotificationsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-600">Receive text message reminders (Premium feature)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.smsNotificationsEnabled}
                    onChange={(e) => updatePreferences({ smsNotificationsEnabled: e.target.checked })}
                    disabled={user.subscriptionTier === 'free'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Default Notification Methods */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Reminder Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              These settings will be used by default when you create new reminders
            </p>

            <div className="space-y-4">
              {preferences.defaultNotificationMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {method.type === 'email' && <Mail className="w-4 h-4 text-gray-600" />}
                    {method.type === 'push' && <Bell className="w-4 h-4 text-gray-600" />}
                    {method.type === 'sms' && <Smartphone className="w-4 h-4 text-gray-600" />}
                    <span className="capitalize font-medium">{method.type}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <select
                      value={method.timing}
                      onChange={(e) => updateNotificationMethod(index, { timing: parseInt(e.target.value) })}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {NOTIFICATION_TIMINGS.map(timing => (
                        <option key={timing.value} value={timing.value}>
                          {timing.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => updateNotificationMethod(index, { enabled: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Enabled</span>
                  </label>

                  <button
                    onClick={() => removeNotificationMethod(index)}
                    className="ml-auto text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <button
                  onClick={() => addNotificationMethod('email')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Add Email
                </button>
                <button
                  onClick={() => addNotificationMethod('push')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Add Push
                </button>
                <button
                  onClick={() => addNotificationMethod('sms')}
                  disabled={user.subscriptionTier === 'free'}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add SMS
                </button>
              </div>
            </div>
          </div>

          {/* Digest Settings */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Digest Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Daily Digest</h4>
                  <p className="text-sm text-gray-600">Get a daily summary of your upcoming reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.dailyDigestEnabled}
                    onChange={(e) => updatePreferences({ dailyDigestEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {preferences.dailyDigestEnabled && (
                <div className="ml-4 flex items-center gap-2">
                  <label className="text-sm text-gray-600">Send at:</label>
                  <input
                    type="time"
                    value={preferences.dailyDigestTime}
                    onChange={(e) => updatePreferences({ dailyDigestTime: e.target.value })}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Weekly Digest</h4>
                  <p className="text-sm text-gray-600">Get a weekly summary of recommended programmes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.weeklyDigestEnabled}
                    onChange={(e) => updatePreferences({ weeklyDigestEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {preferences.weeklyDigestEnabled && (
                <div className="ml-4 flex items-center gap-2">
                  <label className="text-sm text-gray-600">Send on:</label>
                  <select
                    value={preferences.weeklyDigestDay}
                    onChange={(e) => updatePreferences({ weeklyDigestDay: parseInt(e.target.value) })}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Reminders */}
        <RemindersList />
      </div>
    </div>
  );
}