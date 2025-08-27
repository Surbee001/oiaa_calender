'use client'

import { useState, useEffect } from 'react'
import { CalendarEvent, EventType, EVENT_TYPES } from '@/types'
import { formatDate } from '@/lib/utils'
import { X, Plus, Trash2, Eye, Edit } from 'lucide-react'
import ColorPicker from './ColorPicker'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] rounded-lg border border-slate-300 flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading editor...</div>
      </div>
    )
  }
)

interface EventModalProps {
  event: CalendarEvent | null
  date: Date
  onSave: (eventData: Partial<CalendarEvent>) => void
  onClose: () => void
}

export default function EventModal({ event, date, onSave, onClose }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: formatDate(date),
    endDate: '',
    type: 'university' as EventType,
    customColor: EVENT_TYPES['university'].bgColor,
    actionItems: ['']
  })
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        endDate: event.endDate || '',
        type: event.type,
        customColor: event.customColor || EVENT_TYPES[event.type].bgColor,
        actionItems: event.actionItems?.length ? event.actionItems : ['']
      })
    } else {
      setFormData({
        title: '',
        description: '',
        date: formatDate(date),
        endDate: '',
        type: 'university',
        customColor: '#6b7280',
        actionItems: ['']
      })
    }
  }, [event, date])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const actionItems = formData.actionItems.filter(item => item.trim() !== '')
    
    onSave({
      ...formData,
      actionItems
    })
  }

  const addActionItem = () => {
    setFormData(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, '']
    }))
  }

  const removeActionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index)
    }))
  }

  const updateActionItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems.map((item, i) => i === index ? value : item)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="professional-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {Object.entries(EVENT_TYPES).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <ColorPicker
              color={formData.customColor}
              onChange={(color) => setFormData(prev => ({ ...prev, customColor: color }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsMarkdownMode(true)}
                  className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                    isMarkdownMode 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setIsMarkdownMode(false)}
                  className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                    !isMarkdownMode 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </button>
              </div>
            </div>
            
            <div className="min-h-[200px] rounded-lg border border-slate-300 overflow-hidden">
              {showEditor ? (
                <MDEditor
                  value={formData.description}
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val || '' }))}
                  preview={isMarkdownMode ? 'edit' : 'preview'}
                  hideToolbar={!isMarkdownMode}
                  data-color-mode="light"
                />
              ) : (
                <div
                  onClick={() => setShowEditor(true)}
                  className="min-h-[200px] p-4 bg-slate-50 cursor-text flex items-start justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  {formData.description ? (
                    <div className="text-left text-slate-700 w-full whitespace-pre-wrap">{formData.description}</div>
                  ) : (
                    <div className="text-center py-16">Click to add description...</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Action Items
              </label>
              <button
                type="button"
                onClick={addActionItem}
                className="inline-flex items-center px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData.actionItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateActionItem(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter action item"
                  />
                  {formData.actionItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActionItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}