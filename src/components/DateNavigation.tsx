'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface DateNavigationProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateNavigation({ selectedDate, onDateChange }: DateNavigationProps) {
  const today = new Date()
  const maxDate = new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000) // 10 days from today

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000)
    if (prevDay >= today) {
      onDateChange(prevDay)
    }
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
    if (nextDay <= maxDate) {
      onDateChange(nextDay)
    }
  }

  const goToToday = () => {
    onDateChange(today)
  }

  const getDayButtons = () => {
    const buttons = []
    for (let i = 0; i < 10; i++) {
      const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const isToday = date.toDateString() === today.toDateString()
      
      buttons.push(
        <button
          key={i}
          onClick={() => onDateChange(date)}
          className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
            isSelected
              ? 'bg-primary-600 text-white shadow-lg scale-105'
              : 'hover:bg-secondary-100 text-secondary-700'
          }`}
        >
          <span className="text-xs font-medium">
            {isToday ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'short' })}
          </span>
          <span className="text-sm font-semibold">
            {date.getDate()}
          </span>
        </button>
      )
    }
    return buttons
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Current Date Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-secondary-500" />
          <span className="text-lg font-semibold text-secondary-900">
            {formatDate(selectedDate.toISOString())}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousDay}
            disabled={selectedDate <= today}
            className="p-2 rounded-lg hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-secondary-600" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            Today
          </button>
          <button
            onClick={goToNextDay}
            disabled={selectedDate >= maxDate}
            className="p-2 rounded-lg hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-secondary-600" />
          </button>
        </div>
      </div>

      {/* Date Buttons */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-secondary-300 scrollbar-track-secondary-100">
        {getDayButtons()}
      </div>
    </div>
  )
}