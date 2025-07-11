'use client';

import { useEffect } from 'react';
import { reminderService } from '@/lib/reminderService';

export default function ReminderInitializer() {
  useEffect(() => {
    // Initialize reminder scheduling when the app starts
    reminderService.initializeScheduling();
  }, []);

  return null; // This component doesn't render anything
}