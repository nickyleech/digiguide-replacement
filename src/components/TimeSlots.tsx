'use client'

interface TimeSlot {
  time: string
  label: string
}

interface TimeSlotsProps {
  slots: TimeSlot[]
}

export function TimeSlots({ slots }: TimeSlotsProps) {
  const getCurrentTimePosition = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Find the position within the slots (6 AM to 2 AM next day)
    const startHour = 6
    const relativeHour = currentHour >= startHour ? currentHour - startHour : currentHour + 24 - startHour
    const percentage = (relativeHour + currentMinute / 60) / slots.length * 100
    
    return percentage
  }

  return (
    <div className="relative">
      {/* Current time indicator */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
        style={{ top: `${getCurrentTimePosition()}%` }}
      >
        <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
        <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
      </div>
      
      {/* Time slots */}
      <div className="divide-y divide-secondary-200">
        {slots.map((slot, index) => (
          <div key={slot.time} className="p-3 text-center">
            <div className="text-sm font-medium text-secondary-900">
              {slot.label}
            </div>
            <div className="text-xs text-secondary-500 mt-1">
              {index === 0 && 'Morning'}
              {index === 6 && 'Afternoon'}
              {index === 12 && 'Evening'}
              {index === 18 && 'Night'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}