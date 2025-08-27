'use client'

import { useState } from 'react'
import { CalendarEvent, EVENT_TYPES } from '@/types'
import { getCalendarDays, formatDate, isSameDayUtil, isSameMonthUtil, WEEKDAYS, MONTHS } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface CalendarProps {
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export default function Calendar({ events, onDateClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarDays = getCalendarDays(currentDate)

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDayUtil(event.date, date))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="professional-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white rounded-md transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white rounded-md transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        <button
          onClick={goToToday}
          className="professional-button professional-button-secondary text-sm"
        >
          Today
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {WEEKDAYS.map(day => (
          <div key={day} className="p-4 text-center text-sm font-semibold text-slate-600 bg-slate-50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonthUtil(day, currentDate)
          const isToday = isSameDayUtil(day, new Date())

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {day.getDate()}
                </span>
                {isCurrentMonth && (
                  <Plus className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                )}
              </div>

              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map(event => {
                  const customStyle = event.customColor ? {
                    backgroundColor: event.customColor,
                    borderColor: event.customColor,
                  } : {}
                  
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className={`event-badge ${!event.customColor ? `event-${event.type}` : 'text-white border'} hover:opacity-90`}
                      style={customStyle}
                      title={event.description}
                    >
                      {event.title}
                    </div>
                  )
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-slate-500 px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}