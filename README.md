# OIAA Calendar - Strategic Operations Playbook

A collaborative calendar application for managing OIAA academic operations, events, and deadlines. Built with Next.js, TypeScript, and Supabase.

## Features

- 📅 Interactive calendar view with monthly navigation
- ✨ Real-time collaboration with multiple users
- 📝 Event management (Create, Read, Update, Delete)
- 🎯 Event categorization (Inbound, Outbound, Events/Trips, Study Tours, University, Holidays)
- 💬 Comments on events
- 📄 PDF export functionality
- 🎨 Responsive UI with Tailwind CSS
- 🔒 Role-based access control (Admin, Editor, Viewer)

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure your Supabase credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase project details:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) if not already enabled

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js 13 App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── Calendar.tsx    # Calendar grid component
│   ├── EventModal.tsx  # Event creation/editing modal
│   └── Header.tsx      # Navigation header
├── lib/               # Utility functions
│   ├── database.ts    # Supabase database operations
│   ├── pdfExport.ts   # PDF generation
│   ├── sampleData.ts  # Sample OIAA events
│   ├── supabase.ts    # Supabase client
│   └── utils.ts       # General utilities
└── types/             # TypeScript type definitions
    └── index.ts       # Shared types
```

## Event Types

The calendar supports six types of events, each with distinct colors:

- **Inbound Tasks** (Green) - Exchange student inbound operations
- **Outbound Tasks** (Blue) - Exchange student outbound operations  
- **Events/Trips** (Purple) - Student activities and field trips
- **Study Tours** (Cyan) - Academic study tour programs
- **University Deadlines** (Gray) - Academic calendar deadlines
- **Holidays** (Red) - Official holidays and breaks

## Usage

### Adding Events

1. Click on any date in the calendar
2. Fill in the event details in the modal
3. Select the appropriate event type
4. Add action items if needed
5. Save the event

### Editing Events

1. Click on an existing event in the calendar
2. Modify the details in the modal
3. Save changes

### PDF Export

Click the "Export PDF" button in the header to generate a formatted PDF document containing all calendar events, organized by month and matching the original OIAA playbook format.

## Database Schema

### Events Table
- `id`: UUID primary key
- `title`: Event title
- `description`: Event description (optional)
- `date`: Event start date
- `end_date`: Event end date (optional)
- `type`: Event type enum
- `action_items`: Array of action items
- `created_by`: User ID who created the event
- `created_at`, `updated_at`: Timestamps

### Users Table
- `id`: UUID (references auth.users)
- `email`: User email
- `name`: Display name
- `role`: User role (admin, editor, viewer)

### Event Comments Table
- `id`: UUID primary key
- `event_id`: References events table
- `user_id`: References users table
- `comment`: Comment text
- `created_at`: Timestamp

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary to OIAA (Office of International Academic Affairs).

## Support

For technical support or questions about the OIAA Calendar system, please contact the development team.