'use client';

import { useState } from 'react';
import { Bell, BellOff, Clock, Settings } from 'lucide-react';
import { Programme } from '@/lib/epgService';
import { reminderService } from '@/lib/reminderService';
import { useAuth } from '@/contexts/AuthContext';
import { NOTIFICATION_TIMINGS } from '@/lib/reminders';

interface ReminderButtonProps {
  programme: Programme;
  className?: string;
  showLabel?: boolean;
}

export default function ReminderButton({ programme, className = '', showLabel = false }: ReminderButtonProps) {
  const { user } = useAuth();
  const [hasReminder, setHasReminder] = useState(
    user ? reminderService.hasReminder(user.id, programme.id) : false
  );
  const [showTimingMenu, setShowTimingMenu] = useState(false);

  if (!user) return null;

  const toggleReminder = (timing?: number) => {
    if (hasReminder) {
      // Remove reminder
      const userReminders = reminderService.getUserReminders(user.id);
      const reminder = userReminders.find(r => r.programmeId === programme.id && r.isActive);
      if (reminder) {
        reminderService.deleteReminder(reminder.id);
        setHasReminder(false);
      }
    } else {
      // Add reminder
      reminderService.createReminder(user.id, programme, timing);
      setHasReminder(true);
    }
    setShowTimingMenu(false);
  };

  const handleClick = () => {
    if (hasReminder) {
      toggleReminder();
    } else {
      setShowTimingMenu(!showTimingMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          hasReminder 
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        } ${className}`}
        title={hasReminder ? 'Remove reminder' : 'Set reminder'}
      >
        {hasReminder ? (
          <BellOff className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
        {showLabel && (
          <span className="text-sm">
            {hasReminder ? 'Reminder set' : 'Remind me'}
          </span>
        )}
      </button>

      {showTimingMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
          <div className="p-2 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Set reminder for:</h3>
            <p className="text-sm text-gray-600">{programme.title}</p>
          </div>
          <div className="py-1">
            {NOTIFICATION_TIMINGS.map((timing) => (
              <button
                key={timing.value}
                onClick={() => toggleReminder(timing.value)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                {timing.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => setShowTimingMenu(false)}
              className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}