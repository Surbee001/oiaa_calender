import { clsx, type ClassValue } from 'clsx'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getCalendarDays(date: Date) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  
  return eachDayOfInterval({ start, end })
}

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function isSameDayUtil(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  return isSameDay(d1, d2)
}

export function isSameMonthUtil(date1: Date, date2: Date): boolean {
  return isSameMonth(date1, date2)
}

export function getDaysInMonth(date: Date): Date[] {
  return getCalendarDays(date)
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]