'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Calendar from '@/components/Calendar'
import TimelineView from '@/components/TimelineView'
import EventModal from '@/components/EventModal'
import Footer from '@/components/Footer'
import { CalendarEvent, EventType } from '@/types'
import { sampleEvents } from '@/lib/sampleData'
import { exportToPDF } from '@/lib/pdfExport'

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar')
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(
    new Set(['inbound', 'outbound', 'event', 'studytour', 'university', 'holiday'])
  )

  useEffect(() => {
    // Load sample data on component mount
    setEvents(sampleEvents)
  }, [])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventModal(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      ))
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventData.title || '',
        description: eventData.description || '',
        date: eventData.date || selectedDate.toISOString().split('T')[0],
        endDate: eventData.endDate,
        type: eventData.type || 'university',
        actionItems: eventData.actionItems || [],
        createdBy: 'Current User', // TODO: Replace with actual user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEvents(prev => [...prev, newEvent])
    }
    
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const handleCloseModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  // Filter events based on active filters
  const filteredEvents = events.filter(event => activeFilters.has(event.type))

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        events={events}
        viewMode={viewMode}
        onExportPDF={() => exportToPDF(filteredEvents)}
        onViewModeChange={setViewMode}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {viewMode === 'calendar' ? (
          <Calendar 
            events={filteredEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <TimelineView
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        )}
      </main>

      <Footer />

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          date={selectedDate}
          onSave={handleSaveEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}