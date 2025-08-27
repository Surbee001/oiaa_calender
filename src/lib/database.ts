import { supabase } from './supabase'
import { CalendarEvent, EventComment, User } from '@/types'

// Events
export async function getEvents(): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    throw error
  }

  return data?.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || undefined,
    date: event.date,
    endDate: event.end_date || undefined,
    type: event.type,
    actionItems: event.action_items || [],
    createdBy: event.created_by,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  })) || []
}

export async function createEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: event.title,
      description: event.description || null,
      date: event.date,
      end_date: event.endDate || null,
      type: event.type,
      action_items: event.actionItems || null,
      created_by: event.createdBy,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || undefined,
    date: data.date,
    endDate: data.end_date || undefined,
    type: data.type,
    actionItems: data.action_items || [],
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('events')
    .update({
      title: updates.title,
      description: updates.description || null,
      date: updates.date,
      end_date: updates.endDate || null,
      type: updates.type,
      action_items: updates.actionItems || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || undefined,
    date: data.date,
    endDate: data.end_date || undefined,
    type: data.type,
    actionItems: data.action_items || [],
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}

// Users
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching users:', error)
    throw error
  }

  return data || []
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching current user:', error)
    return null
  }

  return data
}

// Comments
export async function getEventComments(eventId: string): Promise<EventComment[]> {
  const { data, error } = await supabase
    .from('event_comments')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    throw error
  }

  return data?.map(comment => ({
    id: comment.id,
    eventId: comment.event_id,
    userId: comment.user_id,
    userName: comment.user_name,
    comment: comment.comment,
    createdAt: comment.created_at,
  })) || []
}

export async function createComment(comment: Omit<EventComment, 'id' | 'createdAt'>): Promise<EventComment> {
  const { data, error } = await supabase
    .from('event_comments')
    .insert([{
      event_id: comment.eventId,
      user_id: comment.userId,
      user_name: comment.userName,
      comment: comment.comment,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    throw error
  }

  return {
    id: data.id,
    eventId: data.event_id,
    userId: data.user_id,
    userName: data.user_name,
    comment: data.comment,
    createdAt: data.created_at,
  }
}

// Real-time subscriptions
export function subscribeToEvents(callback: (event: CalendarEvent) => void) {
  return supabase
    .channel('events')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'events' 
    }, (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        const event = payload.new
        callback({
          id: event.id,
          title: event.title,
          description: event.description || undefined,
          date: event.date,
          endDate: event.end_date || undefined,
          type: event.type,
          actionItems: event.action_items || [],
          createdBy: event.created_by,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
        })
      }
    })
    .subscribe()
}

export function subscribeToComments(eventId: string, callback: (comment: EventComment) => void) {
  return supabase
    .channel(`comments-${eventId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'event_comments',
      filter: `event_id=eq.${eventId}`
    }, (payload) => {
      const comment = payload.new
      callback({
        id: comment.id,
        eventId: comment.event_id,
        userId: comment.user_id,
        userName: comment.user_name,
        comment: comment.comment,
        createdAt: comment.created_at,
      })
    })
    .subscribe()
}