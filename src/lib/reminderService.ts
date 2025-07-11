import { ProgrammeReminder, ReminderPreferences, NotificationMethod, ReminderNotification, DEFAULT_REMINDER_PREFERENCES } from './reminders';
import { Programme } from './epgService';

class ReminderService {
  private reminders: ProgrammeReminder[] = [];
  private preferences: Map<string, ReminderPreferences> = new Map();

  // Local storage keys
  private readonly REMINDERS_KEY = 'tv-guide-reminders';
  private readonly PREFERENCES_KEY = 'tv-guide-reminder-preferences';

  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    try {
      const storedReminders = localStorage.getItem(this.REMINDERS_KEY);
      if (storedReminders) {
        this.reminders = JSON.parse(storedReminders).map((reminder: any) => ({
          ...reminder,
          startTime: new Date(reminder.startTime),
          endTime: new Date(reminder.endTime),
          reminderTime: new Date(reminder.reminderTime),
          createdAt: new Date(reminder.createdAt),
          updatedAt: new Date(reminder.updatedAt)
        }));
      }

      const storedPreferences = localStorage.getItem(this.PREFERENCES_KEY);
      if (storedPreferences) {
        const prefsData = JSON.parse(storedPreferences);
        Object.entries(prefsData).forEach(([userId, prefs]: [string, any]) => {
          this.preferences.set(userId, {
            ...prefs,
            createdAt: new Date(prefs.createdAt),
            updatedAt: new Date(prefs.updatedAt)
          });
        });
      }
    } catch (error) {
      console.error('Error loading reminders from storage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.REMINDERS_KEY, JSON.stringify(this.reminders));
      
      const prefsObj = Object.fromEntries(this.preferences.entries());
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(prefsObj));
    } catch (error) {
      console.error('Error saving reminders to storage:', error);
    }
  }

  // Create a new reminder
  createReminder(
    userId: string,
    programme: Programme,
    customTiming?: number
  ): ProgrammeReminder {
    const userPrefs = this.getUserPreferences(userId);
    const defaultTiming = userPrefs.defaultNotificationMethods[0]?.timing || 15;
    const timing = customTiming || defaultTiming;

    const reminder: ProgrammeReminder = {
      id: this.generateId(),
      userId,
      programmeId: programme.id,
      programmeTitle: programme.title,
      channelName: programme.channel,
      startTime: new Date(programme.startTime),
      endTime: new Date(programme.endTime),
      reminderTime: new Date(new Date(programme.startTime).getTime() - timing * 60000),
      notificationMethods: userPrefs.defaultNotificationMethods,
      isActive: true,
      isTriggered: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reminders.push(reminder);
    this.saveToStorage();
    
    // Schedule the reminder
    this.scheduleReminder(reminder);

    return reminder;
  }

  // Get all reminders for a user
  getUserReminders(userId: string): ProgrammeReminder[] {
    return this.reminders.filter(reminder => reminder.userId === userId);
  }

  // Get active reminders for a user
  getActiveReminders(userId: string): ProgrammeReminder[] {
    return this.reminders.filter(
      reminder => reminder.userId === userId && reminder.isActive && !reminder.isTriggered
    );
  }

  // Get reminder by ID
  getReminder(reminderId: string): ProgrammeReminder | undefined {
    return this.reminders.find(reminder => reminder.id === reminderId);
  }

  // Check if a programme has a reminder
  hasReminder(userId: string, programmeId: string): boolean {
    return this.reminders.some(
      reminder => reminder.userId === userId && 
                 reminder.programmeId === programmeId && 
                 reminder.isActive
    );
  }

  // Update reminder
  updateReminder(reminderId: string, updates: Partial<ProgrammeReminder>): boolean {
    const index = this.reminders.findIndex(reminder => reminder.id === reminderId);
    if (index === -1) return false;

    this.reminders[index] = {
      ...this.reminders[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage();
    return true;
  }

  // Delete reminder
  deleteReminder(reminderId: string): boolean {
    const index = this.reminders.findIndex(reminder => reminder.id === reminderId);
    if (index === -1) return false;

    this.reminders.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Toggle reminder active state
  toggleReminder(reminderId: string): boolean {
    const reminder = this.getReminder(reminderId);
    if (!reminder) return false;

    return this.updateReminder(reminderId, { isActive: !reminder.isActive });
  }

  // Get user preferences
  getUserPreferences(userId: string): ReminderPreferences {
    const existing = this.preferences.get(userId);
    if (existing) return existing;

    // Create default preferences for new user
    const defaultPrefs: ReminderPreferences = {
      ...DEFAULT_REMINDER_PREFERENCES,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.preferences.set(userId, defaultPrefs);
    this.saveToStorage();
    return defaultPrefs;
  }

  // Update user preferences
  updateUserPreferences(userId: string, updates: Partial<ReminderPreferences>): boolean {
    const existing = this.getUserPreferences(userId);
    
    const updated: ReminderPreferences = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.preferences.set(userId, updated);
    this.saveToStorage();
    return true;
  }

  // Schedule reminder notification
  private scheduleReminder(reminder: ProgrammeReminder): void {
    const now = new Date();
    const timeUntilReminder = reminder.reminderTime.getTime() - now.getTime();

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        this.triggerReminder(reminder);
      }, timeUntilReminder);
    }
  }

  // Trigger reminder notification
  private triggerReminder(reminder: ProgrammeReminder): void {
    if (!reminder.isActive || reminder.isTriggered) return;

    // Mark as triggered
    this.updateReminder(reminder.id, { isTriggered: true });

    // Send notifications based on enabled methods
    reminder.notificationMethods.forEach(method => {
      if (method.enabled) {
        this.sendNotification(reminder, method.type);
      }
    });
  }

  // Send notification
  private sendNotification(reminder: ProgrammeReminder, method: 'email' | 'push' | 'sms'): void {
    const message = `Reminder: "${reminder.programmeTitle}" starts in ${this.getTimingText(reminder)} on ${reminder.channelName}`;

    switch (method) {
      case 'push':
        this.sendPushNotification(reminder, message);
        break;
      case 'email':
        this.sendEmailNotification(reminder, message);
        break;
      case 'sms':
        this.sendSMSNotification(reminder, message);
        break;
    }
  }

  // Send push notification
  private sendPushNotification(reminder: ProgrammeReminder, message: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`TV Guide Reminder`, {
        body: message,
        icon: '/favicon.ico',
        tag: reminder.id
      });
    }
  }

  // Send email notification (placeholder for actual implementation)
  private sendEmailNotification(reminder: ProgrammeReminder, message: string): void {
    // In a real implementation, this would call an email service API
    console.log('Email notification:', message);
  }

  // Send SMS notification (placeholder for actual implementation)
  private sendSMSNotification(reminder: ProgrammeReminder, message: string): void {
    // In a real implementation, this would call an SMS service API
    console.log('SMS notification:', message);
  }

  // Get timing text for display
  private getTimingText(reminder: ProgrammeReminder): string {
    const now = new Date();
    const minutesUntil = Math.floor((reminder.startTime.getTime() - now.getTime()) / 60000);
    
    if (minutesUntil < 0) return 'now';
    if (minutesUntil === 0) return 'right now';
    if (minutesUntil < 60) return `${minutesUntil} minutes`;
    
    const hours = Math.floor(minutesUntil / 60);
    const mins = minutesUntil % 60;
    
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} and ${mins} minute${mins > 1 ? 's' : ''}`;
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Get upcoming reminders for a user
  getUpcomingReminders(userId: string, hours: number = 24): ProgrammeReminder[] {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);

    return this.getActiveReminders(userId).filter(
      reminder => reminder.startTime >= now && reminder.startTime <= future
    ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // Initialize reminder scheduling on app start
  initializeScheduling(): void {
    const now = new Date();
    
    // Schedule all future reminders
    this.reminders
      .filter(reminder => reminder.isActive && !reminder.isTriggered && reminder.reminderTime > now)
      .forEach(reminder => this.scheduleReminder(reminder));
  }
}

export const reminderService = new ReminderService();