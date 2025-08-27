import { CalendarEvent } from '@/types'

export const sampleEvents: CalendarEvent[] = [
  // August 2025
  {
    id: '1',
    title: 'New students orientation week begins',
    description: 'University Faculty members report to work & New students orientation week begins.',
    date: '2025-08-18',
    type: 'university',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Credit transfer & change of major requests',
    description: 'University Period for accepting credit transfer & change of major requests.',
    date: '2025-08-18',
    endDate: '2025-08-22',
    type: 'university',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Last day of admission for Fall Semester',
    description: 'University Last day of admission for Fall Semester.',
    date: '2025-08-22',
    type: 'university',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: '1st Call for Outbound Exchange Nominations',
    description: 'Launch campus-wide poster campaign. Add prominent "Apply for Exchange!" button to the OIAA website homepage. Targeted email blast to all eligible undergraduate students.',
    date: '2025-08-25',
    type: 'outbound',
    actionItems: [
      'Launch campus-wide poster campaign',
      'Add prominent "Apply for Exchange!" button to the OIAA website homepage',
      'Targeted email blast to all eligible undergraduate students'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Beginning of classes',
    description: 'University Beginning of classes.',
    date: '2025-08-25',
    type: 'university',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // September 2025
  {
    id: '6',
    title: 'Advising sessions for outbound exchange',
    description: 'Outbound Advising sessions for students interested in outbound exchange.',
    date: '2025-09-08',
    endDate: '2025-09-19',
    type: 'outbound',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '7',
    title: 'Trip to Louvre AD / Grand Mosque',
    description: 'Event Trip to Louvre AD / Grand Mosque',
    date: '2025-09-12',
    type: 'event',
    actionItems: [
      'Confirm and book transportation (bus)',
      'Purchase group tickets one week in advance',
      'Send event details (itinerary, meeting point) to students 3 days prior'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '8',
    title: '1st Call for Inbound Exchange Nominations',
    description: 'Inbound 1st Call for Inbound Exchange Nominations (for Spring 2026).',
    date: '2025-09-22',
    type: 'inbound',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '9',
    title: 'Nomination period for outbound students',
    description: 'Outbound Nomination period for outbound students for Spring 2026.',
    date: '2025-09-22',
    endDate: '2025-10-03',
    type: 'outbound',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '10',
    title: 'Trip to Dubai Frame / Dubai Mall',
    description: 'Event Trip to Dubai Frame / Dubai Mall',
    date: '2025-09-26',
    type: 'event',
    actionItems: [
      'Confirm and book transportation',
      'Purchase tickets for Dubai Frame',
      'Send event details and meeting points to students'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // October 2025
  {
    id: '11',
    title: '2nd Call for Outbound Exchange Nominations',
    description: 'Outbound 2nd Call for Outbound Exchange Nominations (for Spring 2026).',
    date: '2025-10-06',
    type: 'outbound',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '12',
    title: 'Trip to Ferrari World - AD',
    description: 'Event Trip to Ferrari World - AD',
    date: '2025-10-10',
    type: 'event',
    actionItems: [
      'Book transportation',
      'Secure group-rate tickets',
      'Send pre-trip information to students'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '13',
    title: 'Trip to Hatta Dam / Kayaking and BBQ',
    description: 'Event Trip to Hatta Dam / Kayaking and BBQ',
    date: '2025-10-24',
    type: 'event',
    actionItems: [
      'Arrange transportation and kayak rentals',
      'Coordinate BBQ catering or supplies',
      'Send detailed itinerary and waiver forms if required'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '14',
    title: 'Beginning of admission period for Spring Semester',
    description: 'University Beginning of admission period for Spring Semester.',
    date: '2025-10-27',
    type: 'university',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '15',
    title: '2nd Call for Inbound Exchange Nominations',
    description: 'Inbound 2nd Call for Inbound Exchange Nominations.',
    date: '2025-10-27',
    type: 'inbound',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // November 2025
  {
    id: '16',
    title: 'Trip to Al Seef Old Souq / Global Village - DXB',
    description: 'Event Trip to Al Seef Old Souq / Global Village - DXB',
    date: '2025-11-07',
    type: 'event',
    actionItems: [
      'Book transportation',
      'Purchase Global Village tickets',
      'Advise students on appropriate attire for the souq'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '17',
    title: '3rd Call for Inbound Exchange Nominations',
    description: 'Inbound 3rd Call for Inbound Exchange Nominations.',
    date: '2025-11-10',
    type: 'inbound',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '18',
    title: 'Trip to Jebel Jais / BBQ - RAK',
    description: 'Event Trip to Jebel Jais / BBQ - RAK',
    date: '2025-11-21',
    type: 'event',
    actionItems: [
      'Book transportation suitable for mountain roads',
      'Arrange BBQ',
      'Advise students to bring warm clothing',
      'Check weather conditions day before trip'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '19',
    title: 'Nomination Deadline',
    description: 'Inbound Nomination Deadline. Process nominations received; note this is a soft deadline. Begin sending ID generation email templates to nominated students. Prepare to send dorm deposit emails post-ID generation.',
    date: '2025-11-21',
    type: 'inbound',
    actionItems: [
      'Process nominations received; note this is a soft deadline',
      'Begin sending ID generation email templates to nominated students',
      'Prepare to send dorm deposit emails post-ID generation'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // December 2025
  {
    id: '20',
    title: 'UAE National Day holiday',
    description: 'Holiday UAE National Day holiday.',
    date: '2025-12-02',
    endDate: '2025-12-03',
    type: 'holiday',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '21',
    title: 'Museum of the Future & Goodbye Dinner',
    description: 'Event Museum of the Future & Goodbye Dinner',
    date: '2025-12-05',
    type: 'event',
    actionItems: [
      'Book museum tickets and dinner reservations',
      'Arrange transportation',
      'Gather feedback on the semesters events'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '22',
    title: 'Pre-arrival Orientation Session',
    description: 'Inbound Pre-arrival Orientation Session. One week prior, poll students to find a suitable time across time zones. Prepare and distribute the Zoom link and session agenda.',
    date: '2025-12-09',
    type: 'inbound',
    actionItems: [
      'One week prior, poll students to find a suitable time across time zones',
      'Prepare and distribute the Zoom link and session agenda'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // January 2026
  {
    id: '23',
    title: 'Winter Study Tour - Batch 1',
    description: 'Study Tour Winter Study Tour - Batch 1',
    date: '2026-01-17',
    endDate: '2026-01-23',
    type: 'studytour',
    actionItems: [
      'Finalize itinerary and academic components',
      'Confirm accommodation and transport',
      'Distribute welcome packs and schedules'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '24',
    title: 'Winter Study Tour - Batch 2',
    description: 'Study Tour Winter Study Tour - Batch 2',
    date: '2026-01-31',
    endDate: '2026-02-06',
    type: 'studytour',
    actionItems: [
      'Repeat all arrangements as for Batch 1'
    ],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // March 2026
  {
    id: '25',
    title: 'Eid Al Fitr Al Mubarak',
    description: 'Holiday Eid Al Fitr Al Mubarak (Tentative).',
    date: '2026-03-19',
    endDate: '2026-03-22',
    type: 'holiday',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '26',
    title: 'Spring Semester break',
    description: 'University Spring Semester break.',
    date: '2026-03-23',
    endDate: '2026-03-27',
    type: 'university',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // May 2026
  {
    id: '27',
    title: 'Eid Al-Adha Holiday',
    description: 'Holiday Eid Al-Adha Holiday (Tentative).',
    date: '2026-05-26',
    endDate: '2026-05-29',
    type: 'holiday',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },

  // June 2026
  {
    id: '28',
    title: 'Hijri New Year',
    description: 'Holiday Hijri New Year (Tentative).',
    date: '2026-06-16',
    type: 'holiday',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '29',
    title: 'Museum of the Future & Goodbye Dinner - DXB',
    description: 'Event Museum of the Future & Goodbye Dinner - DXB',
    date: '2026-06-12',
    type: 'event',
    actionItems: [],
    createdBy: 'OIAA System',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
]