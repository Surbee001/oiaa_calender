export type EventType = 'inbound' | 'outbound' | 'event' | 'studytour' | 'university' | 'holiday';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  type: EventType;
  customColor?: string; // Custom hex color for the event
  actionItems?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface EventComment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface CustomFilter {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export const EVENT_TYPES: Record<EventType, { label: string; color: string; bgColor: string }> = {
  inbound: { label: 'Inbound Tasks', color: 'text-green-800', bgColor: 'bg-green-100' },
  outbound: { label: 'Outbound Tasks', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  event: { label: 'Events / Trips', color: 'text-purple-800', bgColor: 'bg-purple-100' },
  studytour: { label: 'Study Tour', color: 'text-cyan-800', bgColor: 'bg-cyan-100' },
  university: { label: 'University Deadline', color: 'text-gray-800', bgColor: 'bg-gray-100' },
  holiday: { label: 'Holiday', color: 'text-red-800', bgColor: 'bg-red-100' },
};