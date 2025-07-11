'use client';

import { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Trash2, Settings, X } from 'lucide-react';
import { ProgrammeReminder } from '@/lib/reminders';
import { reminderService } from '@/lib/reminderService';
import { useAuth } from '@/contexts/AuthContext';

interface RemindersListProps {
  className?: string;
}

export default function RemindersList({ className = '' }: RemindersListProps) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<ProgrammeReminder[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (user) {
      loadReminders();
    }
  }, [user, filter]);

  const loadReminders = () => {
    if (!user) return;

    let userReminders = reminderService.getUserReminders(user.id);

    switch (filter) {
      case 'upcoming':
        userReminders = userReminders.filter(r => r.isActive && !r.isTriggered);
        break;
      case 'past':
        userReminders = userReminders.filter(r => r.isTriggered);
        break;
      case 'all':
      default:
        // Show all reminders
        break;
    }

    userReminders.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    setReminders(userReminders);
  };

  const deleteReminder = (reminderId: string) => {
    reminderService.deleteReminder(reminderId);
    loadReminders();
  };

  const toggleReminder = (reminderId: string) => {
    reminderService.toggleReminder(reminderId);
    loadReminders();
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (reminder: ProgrammeReminder) => {
    if (reminder.isTriggered) return 'text-gray-500';
    if (!reminder.isActive) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusText = (reminder: ProgrammeReminder) => {
    if (reminder.isTriggered) return 'Triggered';
    if (!reminder.isActive) return 'Disabled';
    return 'Active';
  };

  if (!user) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Please sign in to manage your reminders</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Reminders</h2>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'past')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No reminders found</p>
            <p className="text-sm mt-1">
              {filter === 'upcoming' 
                ? 'Set reminders for programmes you don\'t want to miss!'
                : 'Your reminder history will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`border border-gray-200 rounded-lg p-4 transition-colors ${
                  reminder.isActive ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{reminder.programmeTitle}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getStatusColor(reminder)}`}>
                        {getStatusText(reminder)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateTime(reminder.startTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(reminder.startTime)} - {formatTime(reminder.endTime)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {reminder.channelName}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        Reminder: {formatDateTime(reminder.reminderTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {reminder.notificationMethods.map((method, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded ${
                            method.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {method.type} ({method.timing}min)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        reminder.isActive
                          ? 'text-red-600 border-red-200 hover:bg-red-50'
                          : 'text-green-600 border-green-200 hover:bg-green-50'
                      }`}
                      title={reminder.isActive ? 'Disable reminder' : 'Enable reminder'}
                    >
                      {reminder.isActive ? <X className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}