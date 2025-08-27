'use client'

import { useState } from 'react'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

const DEFAULT_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#64748b', // Slate
  '#6b7280', // Gray
]

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState(color)

  const handleColorSelect = (selectedColor: string) => {
    onChange(selectedColor)
    setIsOpen(false)
  }

  const handleCustomColorSubmit = () => {
    onChange(customColor)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Event Color
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg shadow-sm bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        <div 
          className="w-6 h-6 rounded-full border-2 border-white shadow-md mr-3"
          style={{ backgroundColor: color }}
        />
        <Palette className="h-4 w-4 text-slate-600 mr-2" />
        <span className="text-sm text-slate-700">Choose Color</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 min-w-[280px]">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Select Color</h4>
            
            {/* Preset Colors */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {DEFAULT_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => handleColorSelect(presetColor)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    color === presetColor 
                      ? 'border-slate-800 shadow-lg' 
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
            
            {/* Custom Color Input */}
            <div className="border-t border-slate-200 pt-3">
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Custom Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 border border-slate-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCustomColorSubmit}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}