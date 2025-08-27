'use client'

import { CalendarEvent, EVENT_TYPES } from '@/types'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface TimelineViewProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export default function TimelineView({ events, onEventClick }: TimelineViewProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Group events by month
  const eventsByMonth = sortedEvents.reduce((acc, event) => {
    const month = format(parseISO(event.date), 'MMMM yyyy')
    if (!acc[month]) acc[month] = []
    acc[month].push(event)
    return acc
  }, {} as Record<string, CalendarEvent[]>)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
          <div key={month} className="professional-card overflow-hidden">
            {/* Month Header */}
            <div className="bg-blue-600 text-white px-6 py-4">
              <h3 className="text-xl font-bold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {month}
              </h3>
            </div>
            
            {/* Events List */}
            <div className="divide-y divide-gray-100">
              {monthEvents.map((event, index) => {
                const eventType = EVENT_TYPES[event.type]
                const eventDate = format(parseISO(event.date), 'MMM dd')
                const endDate = event.endDate ? ` - ${format(parseISO(event.endDate), 'MMM dd')}` : ''
                
                const customStyle = event.customColor ? {
                  backgroundColor: event.customColor,
                  borderColor: event.customColor,
                } : {}

                return (
                  <div 
                    key={event.id}
                    className="p-6 hover:bg-slate-50 cursor-pointer transition-all duration-200"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Date Column */}
                      <div className="flex-shrink-0 w-24">
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">{eventDate}{endDate}</span>
                        </div>
                        {/* Event Type Indicator */}
                        <div 
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${!event.customColor ? `event-${event.type}` : 'text-white border'} shadow-md`}
                          style={customStyle}
                        >
                          {eventType.label}
                        </div>
                      </div>
                      
                      {/* Content Column */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          {event.title}
                        </h4>
                        
                        {event.description && (
                          <div className="mb-4">
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 prose prose-sm max-w-none text-slate-700">
                              <ReactMarkdown>
                                {event.description}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                        
                        {/* Action Items */}
                        {event.actionItems && event.actionItems.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Action Items:</h5>
                            <ul className="space-y-1">
                              {event.actionItems.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}