'use client'

import { useState, useEffect } from 'react'
import { CalendarEvent, EVENT_TYPES, CustomFilter, EventType } from '@/types'
import { Download, Calendar as CalendarIcon, Filter, List, Grid, Settings, Plus } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  events: CalendarEvent[]
  viewMode: 'calendar' | 'timeline'
  onExportPDF: () => void
  onViewModeChange: (mode: 'calendar' | 'timeline') => void
  activeFilters: Set<EventType>
  onFilterChange: (filters: Set<EventType>) => void
}

export default function Header({ events, viewMode, onExportPDF, onViewModeChange, activeFilters, onFilterChange }: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([])
  const [showAddFilter, setShowAddFilter] = useState(false)
  const [newFilterName, setNewFilterName] = useState('')
  const [newFilterColor, setNewFilterColor] = useState('#3b82f6')

  useEffect(() => {
    // TODO: Replace with actual admin check
    // For now, we'll assume users are guests by default unless they've authenticated as admin
    setIsAdmin(false) // Users start as guests, admin login required for admin access
    
    // Load custom filters from localStorage
    const saved = localStorage.getItem('oiaa-custom-filters')
    if (saved) {
      setCustomFilters(JSON.parse(saved))
    }
  }, [])

  const toggleFilter = (type: EventType) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    onFilterChange(newFilters)
  }

  const handleAddCustomFilter = () => {
    if (newFilterName.trim()) {
      const newFilter: CustomFilter = {
        id: Date.now().toString(),
        name: newFilterName.trim(),
        color: newFilterColor,
        createdAt: new Date().toISOString()
      }
      
      const updatedFilters = [...customFilters, newFilter]
      setCustomFilters(updatedFilters)
      localStorage.setItem('oiaa-custom-filters', JSON.stringify(updatedFilters))
      
      setNewFilterName('')
      setNewFilterColor('#3b82f6')
      setShowAddFilter(false)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              OIAA Calendar
            </h1>
            <p className="text-sm text-slate-600">Strategic Operations Playbook 2025-2026</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('calendar')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Grid className="h-4 w-4 mr-2" />
                Calendar
              </button>
              <button
                onClick={() => onViewModeChange('timeline')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'timeline' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                Timeline
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="professional-button professional-button-secondary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            <Link
              href="/admin"
              className="professional-button professional-button-secondary"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isAdmin ? 'Admin' : 'Admin Login'}
            </Link>

            {!isAdmin && (
              <div className="inline-flex items-center px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                Browsing as Guest
              </div>
            )}

            <button
              onClick={onExportPDF}
              className="professional-button professional-button-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-6 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-800">Event Filters</h3>
              <button 
                onClick={() => setShowAddFilter(true)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(EVENT_TYPES).map(([type, config]) => {
                const isActive = activeFilters.has(type as EventType)
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type as EventType)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                      isActive 
                        ? type === 'inbound' ? 'bg-green-500 text-white border-green-600' :
                          type === 'outbound' ? 'bg-blue-500 text-white border-blue-600' :
                          type === 'event' ? 'bg-purple-500 text-white border-purple-600' :
                          type === 'studytour' ? 'bg-cyan-500 text-white border-cyan-600' :
                          type === 'university' ? 'bg-gray-500 text-white border-gray-600' :
                          'bg-red-500 text-white border-red-600'
                        : type === 'inbound' ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' :
                          type === 'outbound' ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200' :
                          type === 'event' ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200' :
                          type === 'studytour' ? 'bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-200' :
                          type === 'university' ? 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200' :
                          'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                    }`}
                  >
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {showAddFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Custom Filter</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter Name</label>
                  <input
                    type="text"
                    value={newFilterName}
                    onChange={(e) => setNewFilterName(e.target.value)}
                    placeholder="Enter filter name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={newFilterColor}
                      onChange={(e) => setNewFilterColor(e.target.value)}
                      className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newFilterColor}
                      onChange={(e) => setNewFilterColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddFilter(false)}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}