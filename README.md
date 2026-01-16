# Get Listings Portal

A production-grade desktop web application for managing real estate leads and opportunities. This portal extends the existing Get Listings mobile SaaS by providing a comprehensive desktop experience for lead management, pipeline tracking, and exclusive appraisal lead handling.

## Features

- **Lead Management**: View, filter, and manage all leads in a powerful table interface
- **Exclusive Appraisal Leads**: Premium upsell feature for high-intent seller leads
- **Pipeline Kanban**: Drag-and-drop pipeline management for opportunities
- **Property Tracking**: Track properties with seller scores and linked leads
- **CEO-Editable Config**: Non-developer can edit pipeline stages, call scripts, SMS/email templates
- **Facebook Lead Ads Integration**: Direct webhook for 50k+ leads/month
- **Google Sheets Import**: Migration tool for existing spreadsheet data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (phone-based)
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query) v5
- **Tables**: TanStack Table v8
- **Drag & Drop**: DnD Kit
- **Hosting**: DigitalOcean (existing infrastructure)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore and Auth enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd get-listings-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with:
   - Firebase configuration (from Firebase Console)
   - Facebook webhook verification token
   - Google Sheets API key (for imports)

5. Deploy Firestore rules and indexes:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── leads/         # Leads CRUD & Facebook webhook
│   │   ├── pipeline/      # Pipeline stages & kanban
│   │   ├── properties/    # Properties API
│   │   ├── config/        # CEO-editable config
│   │   └── import/        # Google Sheets import
│   ├── leads/             # Leads list page
│   ├── exclusive-leads/   # Premium leads page
│   ├── properties/        # Properties page
│   ├── opportunities/     # Pipeline/kanban page
│   ├── settings/          # Admin settings
│   └── login/             # Phone auth login
├── components/
│   ├── layout/            # App shell, sidebar, header
│   ├── leads/             # LeadsTable, LeadProfile
│   └── pipeline/          # PipelineKanban
├── lib/
│   ├── firebase/          # Firebase client & admin SDK
│   ├── auth/              # Authentication utilities
│   └── services/          # Business logic services
├── types/                 # TypeScript type definitions
└── styles/               # Global CSS & Tailwind
```

## Key Workflows

### Facebook Lead Ads Webhook

1. Configure Facebook Lead Ads to send webhooks to `/api/leads/facebook`
2. Leads are stored raw in `facebook_leads_raw` collection
3. Background processor deduplicates and creates Lead records
4. Phone number is normalized to E.164 format (Australian mobile)

### Pipeline Management

1. Opportunities are created from qualified leads
2. Drag-and-drop between stages on the kanban board
3. Pipeline stages are CEO-editable in Settings

### Lead Deduplication

Leads are deduplicated using a `dedup_key`:
- Format: `{normalized_phone}:{property_address_slug}:{source}`
- Same person, same property, same source = same lead

## API Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete API documentation.

## Firebase Setup

### Firestore Collections

- `users` - User profiles (synced from mobile app)
- `leads` - All leads (phone is primary identity)
- `properties` - Properties with seller scores
- `opportunities` - Pipeline items
- `activities` - Lead timeline activities
- `facebook_leads_raw` - Raw Facebook webhook payloads
- `config` - CEO-editable configuration

### Security Rules

See `firestore.rules` for role-based access control.

### Indexes

See `firestore.indexes.json` for required composite indexes.

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to DigitalOcean App Platform or your preferred host

3. Set environment variables in your hosting platform

4. Deploy Firestore rules:
```bash
firebase deploy --only firestore
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run type checking and linting
4. Submit a pull request

## License

Proprietary - Get Listings Pty Ltd
