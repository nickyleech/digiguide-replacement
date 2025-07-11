export interface ProgrammeReminder {
  id: string;
  userId: string;
  programmeId: string;
  programmeTitle: string;
  channelName: string;
  startTime: Date;
  endTime: Date;
  reminderTime: Date;
  notificationMethods: NotificationMethod[];
  isActive: boolean;
  isTriggered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationMethod {
  type: 'email' | 'push' | 'sms';
  enabled: boolean;
  timing: number; // minutes before programme starts
}

export interface ReminderPreferences {
  userId: string;
  defaultNotificationMethods: NotificationMethod[];
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  dailyDigestEnabled: boolean;
  dailyDigestTime: string; // HH:MM format
  weeklyDigestEnabled: boolean;
  weeklyDigestDay: number; // 0-6, Sunday to Saturday
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  type: 'reminder' | 'digest' | 'weekly';
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface ReminderNotification {
  id: string;
  reminderId: string;
  method: 'email' | 'push' | 'sms';
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  scheduledAt: Date;
  sentAt?: Date;
  failureReason?: string;
  recipient: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_REMINDER_PREFERENCES: Omit<ReminderPreferences, 'userId' | 'createdAt' | 'updatedAt'> = {
  defaultNotificationMethods: [
    { type: 'email', enabled: true, timing: 15 },
    { type: 'push', enabled: true, timing: 5 }
  ],
  emailNotificationsEnabled: true,
  pushNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  dailyDigestEnabled: false,
  dailyDigestTime: '09:00',
  weeklyDigestEnabled: false,
  weeklyDigestDay: 0, // Sunday
  timeZone: 'Europe/London'
};

export const NOTIFICATION_TIMINGS = [
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' }
] as const;