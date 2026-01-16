# Get Listings Portal - Architecture Document

## Executive Summary

This document defines the architecture for extending Get Listings from a mobile-first SaaS into a unified desktop + mobile platform. The desktop portal serves as the "app on desktop" while introducing a premium "Exclusive Appraisal Leads" module for agency operations.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              GET LISTINGS ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐           │
│  │   Mobile App     │    │  Desktop Portal  │    │  Admin Portal    │           │
│  │   (Existing)     │    │   (New - MVP)    │    │  (New - MVP)     │           │
│  │                  │    │                  │    │                  │           │
│  │  • Seller scores │    │  • App dashboard │    │  • Config mgmt   │           │
│  │  • AI insights   │    │  • Leads table   │    │  • Pipeline edit │           │
│  │  • Property view │    │  • Lead profiles │    │  • Script editor │           │
│  │                  │    │  • Pipeline view │    │  • User mgmt     │           │
│  │                  │    │  • EAL section   │    │                  │           │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘           │
│           │                       │                       │                      │
│           └───────────────────────┼───────────────────────┘                      │
│                                   │                                              │
│                                   ▼                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                          API LAYER (Node.js)                              │   │
│  │                                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │ Auth API    │  │ Leads API   │  │ Pipeline API│  │ Webhook API │      │   │
│  │  │             │  │             │  │             │  │             │      │   │
│  │  │ • Verify    │  │ • CRUD      │  │ • Stages    │  │ • FB Ingest │      │   │
│  │  │ • Sessions  │  │ • Search    │  │ • Move      │  │ • Dedup     │      │   │
│  │  │ • Roles     │  │ • Bulk ops  │  │ • History   │  │ • Retry     │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │Property API │  │Activity API │  │ Config API  │  │ Import API  │      │   │
│  │  │             │  │             │  │             │  │             │      │   │
│  │  │ • Lookup    │  │ • Timeline  │  │ • Stages    │  │ • Sheets    │      │   │
│  │  │ • Scores    │  │ • Log       │  │ • Scripts   │  │ • CSV       │      │   │
│  │  │ • Link lead │  │ • Notes     │  │ • Rules     │  │ • Mapping   │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                              │
│                                   ▼                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                         DATA LAYER (Firebase)                             │   │
│  │                                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │   leads     │  │ properties  │  │opportunities│  │ activities  │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │   users     │  │   config    │  │  raw_leads  │  │   imports   │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                              EXTERNAL INTEGRATIONS

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Facebook Ads   │───▶│  Webhook API    │    │  Google Sheets  │
│  (Lead Gen)     │    │  /api/leads/fb  │    │  (Migration)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         │ 50k+ leads/month                             │ One-time import
         └──────────────────────────────────────────────┘
```

---

## 2. Data Schema

### 2.1 Core Entities

```typescript
// Lead - The central entity. One lead, multiple execution modes.
interface Lead {
  id: string;                    // Firestore auto-ID
  
  // Identity
  first_name: string;
  last_name: string;
  phone: string;                 // PRIMARY IDENTITY (E.164 format)
  email?: string;
  
  // Source tracking
  source: 'facebook' | 'app' | 'import' | 'manual';
  facebook_lead_id?: string;     // For FB deduplication
  
  // Execution mode
  is_exclusive: boolean;         // true = EAL (agency), false = DIY (app)
  
  // Ownership
  assigned_agent_id?: string;
  created_by_id: string;
  
  // Metadata
  raw_payload?: Record<string, any>;  // Store full FB payload unmodified
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Denormalized for query performance
  property_address?: string;
  current_stage?: string;
  seller_score?: number;
}

// Property - Linked to leads, carries prediction data
interface Property {
  id: string;
  
  // Address components (canonical)
  address: string;               // Full formatted address
  unit_number?: string;
  street_number: string;
  street_name: string;
  suburb: string;
  state: string;
  postcode: string;
  country: 'AU' | 'NZ' | 'US';
  
  // Prediction data (from existing engine)
  seller_score: number;          // 0-100
  seller_score_updated_at: Timestamp;
  
  // Property metadata
  property_type?: 'house' | 'apartment' | 'townhouse' | 'land' | 'other';
  bedrooms?: number;
  bathrooms?: number;
  land_size_sqm?: number;
  
  // Links
  linked_lead_ids: string[];     // Multiple leads can relate to one property
  
  // AI insights (from existing engine)
  ai_insights?: {
    motivation_signals: string[];
    recommended_approach?: string;
    comparable_sales?: Array<{
      address: string;
      sale_price: number;
      sale_date: string;
    }>;
  };
  
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Opportunity - Pipeline position for a lead+property combination
interface Opportunity {
  id: string;
  
  lead_id: string;
  property_id?: string;          // Optional - lead may not have property yet
  
  // Pipeline position
  stage_id: string;              // References config.pipeline_stages
  stage_entered_at: Timestamp;
  
  // Execution mode
  is_exclusive: boolean;         // Inherited from lead, can override
  
  // Ownership
  assigned_agent_id: string;
  
  // Tracking
  expected_close_date?: Timestamp;
  expected_value?: number;
  
  // Outcome
  outcome?: 'won' | 'lost' | 'stale';
  outcome_reason?: string;
  closed_at?: Timestamp;
  
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Activity - Timeline events for leads
interface Activity {
  id: string;
  
  lead_id: string;
  opportunity_id?: string;       // Optional link
  
  type: 'call' | 'sms' | 'email' | 'note' | 'stage_change' | 'appraisal_sent' | 'appointment' | 'system';
  
  // Content
  content: string;               // Activity description or note content
  metadata?: {
    call_duration_seconds?: number;
    call_outcome?: 'answered' | 'voicemail' | 'no_answer' | 'busy';
    email_subject?: string;
    from_stage?: string;
    to_stage?: string;
    appointment_datetime?: Timestamp;
  };
  
  created_by_id: string;
  created_at: Timestamp;
}

// User - Extends existing Firebase auth
interface User {
  id: string;                    // Firebase Auth UID
  
  phone: string;                 // PRIMARY IDENTITY
  email?: string;
  
  // Profile
  first_name: string;
  last_name: string;
  avatar_url?: string;
  
  // Role & access
  role: 'agent' | 'staff' | 'admin';
  
  // For staff users - which agents they support
  linked_agent_ids?: string[];
  
  // Subscription (links to existing billing)
  subscription_tier: 'free' | 'pro' | 'agency';
  has_exclusive_access: boolean;  // EAL section visibility
  
  // Agency association
  agency_id?: string;
  
  created_at: Timestamp;
  updated_at: Timestamp;
  last_login_at?: Timestamp;
}

// RawLead - Immutable storage for webhook payloads
interface RawLead {
  id: string;
  
  source: 'facebook' | 'other';
  source_id: string;             // facebook_lead_id or equivalent
  
  payload: Record<string, any>;  // Unmodified webhook payload
  
  // Processing status
  processed: boolean;
  processed_at?: Timestamp;
  processed_lead_id?: string;    // Reference to created Lead
  
  // Deduplication
  dedup_key: string;             // Composite key for dedup lookup
  
  received_at: Timestamp;
}

// Config - CEO-editable configuration
interface Config {
  id: string;                    // 'pipeline' | 'scripts' | 'rules' | 'copy'
  
  data: PipelineConfig | ScriptsConfig | RulesConfig | CopyConfig;
  
  updated_by_id: string;
  updated_at: Timestamp;
  version: number;               // For optimistic locking
}
```

### 2.2 Configuration Schemas (CEO-Editable)

```typescript
// Pipeline stages - fully configurable
interface PipelineConfig {
  stages: Array<{
    id: string;
    name: string;
    order: number;
    color: string;
    is_terminal: boolean;        // Won/Lost stages
    auto_actions?: string[];     // Trigger IDs on entry
  }>;
  
  default_stage_id: string;
}

// Scripts/Templates
interface ScriptsConfig {
  sms_templates: Array<{
    id: string;
    name: string;
    content: string;             // Supports {{first_name}}, {{property_address}}, etc.
    stage_id?: string;           // Suggested for stage
  }>;
  
  email_templates: Array<{
    id: string;
    name: string;
    subject: string;
    body: string;
  }>;
  
  call_scripts: Array<{
    id: string;
    name: string;
    content: string;
    stage_id?: string;
  }>;
}

// Automation rules
interface RulesConfig {
  rules: Array<{
    id: string;
    name: string;
    enabled: boolean;
    trigger: {
      type: 'stage_enter' | 'inactivity' | 'score_change' | 'new_lead';
      conditions: Record<string, any>;
    };
    actions: Array<{
      type: 'notify' | 'assign' | 'tag' | 'move_stage';
      params: Record<string, any>;
    }>;
  }>;
}

// UI Copy - editable text
interface CopyConfig {
  upsells: {
    eal_banner_headline: string;
    eal_banner_body: string;
    eal_cta_text: string;
    app_upsell_headline: string;
    app_upsell_body: string;
  };
  
  stages: Record<string, {
    empty_state_title: string;
    empty_state_body: string;
  }>;
}
```

---

## 3. API Contracts

### 3.1 Facebook Webhook Endpoint

```typescript
/**
 * POST /api/leads/facebook
 * 
 * Critical endpoint for high-volume lead ingestion.
 * Design principles:
 * - Accept fast, process async
 * - Store raw payload unmodified
 * - Idempotent (safe to retry)
 * - No business logic in handler
 */

// Request (Facebook Lead Ads webhook payload)
interface FacebookWebhookRequest {
  object: 'page';
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: 'leadgen';
      value: {
        form_id: string;
        leadgen_id: string;       // This is facebook_lead_id
        created_time: number;
        page_id: string;
        ad_id?: string;
        adgroup_id?: string;
      };
    }>;
  }>;
}

// Response
interface FacebookWebhookResponse {
  success: boolean;
  received_count: number;
  message?: string;
}

// Internal processing (async)
// 1. Store in raw_leads collection immediately
// 2. Return 200 OK
// 3. Background job processes:
//    a. Fetch full lead data from FB API
//    b. Deduplicate by facebook_lead_id
//    c. Fallback dedup by phone if present
//    d. Create Lead entity
//    e. Attempt property match
//    f. Create Opportunity in default stage
```

### 3.2 Leads API

```typescript
// GET /api/leads
interface GetLeadsRequest {
  // Pagination
  limit?: number;                // Default 50, max 200
  cursor?: string;               // Firestore cursor
  
  // Filters
  is_exclusive?: boolean;
  stage_id?: string;
  assigned_agent_id?: string;
  source?: 'facebook' | 'app' | 'import' | 'manual';
  created_after?: string;        // ISO date
  created_before?: string;
  search?: string;               // Name, phone, address search
  
  // Sorting
  sort_by?: 'created_at' | 'updated_at' | 'seller_score' | 'name';
  sort_order?: 'asc' | 'desc';
}

interface GetLeadsResponse {
  leads: Lead[];
  next_cursor?: string;
  total_count: number;
}

// GET /api/leads/:id
interface GetLeadResponse {
  lead: Lead;
  property?: Property;
  opportunity?: Opportunity;
  recent_activities: Activity[];
}

// POST /api/leads
interface CreateLeadRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  source?: 'manual' | 'import';
  is_exclusive?: boolean;
  property_address?: string;
  assigned_agent_id?: string;
}

// PATCH /api/leads/:id
interface UpdateLeadRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_exclusive?: boolean;
  assigned_agent_id?: string;
}

// POST /api/leads/bulk
interface BulkLeadActionRequest {
  lead_ids: string[];
  action: 'assign' | 'move_stage' | 'delete' | 'export';
  params?: {
    assigned_agent_id?: string;
    stage_id?: string;
  };
}
```

### 3.3 Pipeline API

```typescript
// GET /api/pipeline/stages
interface GetStagesResponse {
  stages: Array<{
    id: string;
    name: string;
    order: number;
    color: string;
    count: number;               // Leads in stage
    total_value?: number;        // Sum of opportunity values
  }>;
}

// POST /api/pipeline/move
interface MoveLeadRequest {
  opportunity_id: string;
  to_stage_id: string;
  note?: string;                 // Optional note for activity log
}

// GET /api/pipeline/kanban
interface GetKanbanResponse {
  columns: Array<{
    stage: Stage;
    opportunities: Array<{
      opportunity: Opportunity;
      lead: Lead;
      property?: Property;
    }>;
  }>;
}
```

### 3.4 Activities API

```typescript
// GET /api/leads/:id/activities
interface GetActivitiesRequest {
  limit?: number;
  cursor?: string;
  type?: Activity['type'];
}

// POST /api/leads/:id/activities
interface CreateActivityRequest {
  type: 'call' | 'sms' | 'email' | 'note' | 'appraisal_sent' | 'appointment';
  content: string;
  metadata?: Record<string, any>;
}
```

### 3.5 Config API (Admin Only)

```typescript
// GET /api/config/:type
// type: 'pipeline' | 'scripts' | 'rules' | 'copy'

// PUT /api/config/:type
interface UpdateConfigRequest {
  data: PipelineConfig | ScriptsConfig | RulesConfig | CopyConfig;
  version: number;               // For optimistic locking
}

// Response includes new version number
interface UpdateConfigResponse {
  success: boolean;
  version: number;
}
```

### 3.6 Import API

```typescript
// POST /api/import/sheets
interface SheetsImportRequest {
  spreadsheet_id: string;
  sheet_name: string;
  column_mapping: {
    first_name: string;          // Column letter or name
    last_name: string;
    phone: string;
    email?: string;
    address?: string;
    stage?: string;
    // ... other mappings
  };
  options: {
    skip_duplicates: boolean;    // By phone
    default_stage_id: string;
    is_exclusive: boolean;
    assigned_agent_id?: string;
  };
}

interface SheetsImportResponse {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stats?: {
    total_rows: number;
    imported: number;
    skipped_duplicates: number;
    errors: number;
  };
}

// GET /api/import/:id/status
// Returns ImportResponse with updated stats
```

---

## 4. UI Screen List & Responsibilities

### 4.1 Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  GET LISTINGS                              [User Menu ▼]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Dashboard        ← Default landing (App experience)    │
│  👥 Leads            ← All leads list                      │
│  🏠 Properties       ← Property database                   │
│  ─────────────────                                         │
│  ⭐ Exclusive Leads  ← Premium section (locked/hidden)     │
│  📈 Pipeline         ← Kanban view                         │
│  ─────────────────                                         │
│  ⚙️ Settings         ← Role-aware settings                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Screen Inventory

| Screen | Route | Responsibility | Access |
|--------|-------|----------------|--------|
| **Dashboard** | `/` | Mirror mobile app: seller insights, high-score properties, AI opportunities, activity feed | All |
| **Leads List** | `/leads` | Searchable, filterable table of all leads. Bulk actions. Click → Lead Profile | All |
| **Lead Profile** | `/leads/:id` | Unified view: lead info, property, timeline, actions. Same screen for app & EAL leads | All (filtered by ownership) |
| **Properties** | `/properties` | Property database with seller scores. Link to leads. | All |
| **Property Detail** | `/properties/:id` | Property insights, linked leads, AI recommendations | All |
| **Exclusive Leads** | `/exclusive` | EAL-only leads table. Spreadsheet-familiar layout. | Agency tier only |
| **Pipeline** | `/pipeline` | Kanban board. Drag-drop stages. Quick actions. | Agency tier only |
| **Settings** | `/settings` | User profile, preferences | All |
| **Settings: Pipeline** | `/settings/pipeline` | Edit pipeline stages (CEO-editable) | Admin only |
| **Settings: Scripts** | `/settings/scripts` | Edit templates (SMS, email, call) | Admin only |
| **Settings: Rules** | `/settings/rules` | Automation rules builder | Admin only |
| **Settings: Team** | `/settings/team` | User management, roles, assignments | Admin only |
| **Settings: Import** | `/settings/import` | Sheets import, CSV upload | Admin only |

### 4.3 Key Screen Specifications

#### Dashboard (Default Landing)
```
┌─────────────────────────────────────────────────────────────┐
│  Good morning, [Name]                      [Search 🔍]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │  Hot Sellers    │ │  AI Insights    │ │  Your Stats   │ │
│  │  ────────────   │ │  ────────────   │ │  ──────────   │ │
│  │  12 properties  │ │  3 new matches  │ │  8 calls      │ │
│  │  85%+ score     │ │  this week      │ │  2 listings   │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
│                                                             │
│  High-Score Properties Near You                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🏠 42 Smith St, Richmond     92%  │ View │ Request │  │  │
│  │ 🏠 15 Oak Ave, Toorak        89%  │ View │ Request │  │  │
│  │ 🏠 8/100 Chapel St, Windsor  87%  │ View │ Request │  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ ⭐ Want exclusive appraisal-ready sellers?              ││
│  │    Get done-for-you leads instead of shared insights.  ││
│  │                                    [Learn More]        ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Leads Table (Sheets Replacement)
```
┌─────────────────────────────────────────────────────────────┐
│  Leads                           [+ Add Lead] [Import ▼]    │
├─────────────────────────────────────────────────────────────┤
│  [Search...] [Source ▼] [Stage ▼] [Date ▼] [Agent ▼]       │
├─────────────────────────────────────────────────────────────┤
│  ☐ │ Name          │ Phone      │ Address       │ Score │...│
│  ──┼───────────────┼────────────┼───────────────┼───────┼───│
│  ☐ │ John Smith    │ 0412...    │ 42 Smith St   │  92%  │...│
│  ☐ │ Mary Johnson  │ 0423...    │ 15 Oak Ave    │  87%  │...│
│  ☐ │ David Wilson  │ 0434...    │ 8/100 Chapel  │  85%  │...│
│  ──┼───────────────┼────────────┼───────────────┼───────┼───│
│                                                             │
│  [☐ Select All]  │ Selected: 0  │ [Bulk Actions ▼]         │
├─────────────────────────────────────────────────────────────┤
│  Showing 1-50 of 1,234          [◀ Prev] [1] [2] [3] [▶]   │
└─────────────────────────────────────────────────────────────┘

Columns (configurable via column picker):
- Name
- Phone  
- Email
- Address
- Date Received
- Seller Score (%)
- Follow-ups (#)
- Appraisal Sent (Y/N)
- Appointment (Y/N)
- Stage
- Assigned Agent
- Source
```

#### Lead Profile (Most Important Screen)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Leads                    [⭐ Exclusive] [Edit]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌──────────────────────────────────────┐ │
│  │             │  │  42 Smith Street, Richmond VIC 3121  │ │
│  │  John       │  │  ────────────────────────────────    │ │
│  │  Smith      │  │  Seller Score: 92%  🔥               │ │
│  │             │  │  3 bed • 2 bath • 450m²              │ │
│  │  📱 0412... │  │                                      │ │
│  │  ✉️ john@.. │  │  [View Property] [Send Appraisal]    │ │
│  │             │  │                                      │ │
│  │  Stage:     │  └──────────────────────────────────────┘ │
│  │  [Qualified]│                                           │
│  │             │  ┌──────────────────────────────────────┐ │
│  │  Agent:     │  │  Timeline                            │ │
│  │  Sarah T.   │  │  ──────────                          │ │
│  │             │  │  📞 Called - Voicemail    2h ago     │ │
│  │  Source:    │  │  📝 Note added            Yesterday  │ │
│  │  Facebook   │  │  ➡️ Moved to Qualified    2 days     │ │
│  │             │  │  ✉️ SMS sent              3 days     │ │
│  └─────────────┘  │  🆕 Lead created          5 days     │ │
│                   └──────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quick Actions                                        │  │
│  │  [📞 Log Call] [💬 Send SMS] [✉️ Email] [📝 Note]   │  │
│  │  [📋 Send Appraisal] [📅 Book Appointment]           │  │
│  │  [➡️ Move Stage ▼]                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Pipeline Kanban
```
┌─────────────────────────────────────────────────────────────┐
│  Pipeline                    [Filter ▼] [View: Kanban ▼]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Lead (12)    │ Qualified (8) │ Contact (5)  │ Appt (3)    │
│  ───────────  │ ───────────── │ ──────────── │ ─────────   │
│  ┌─────────┐  │ ┌─────────┐   │ ┌─────────┐  │ ┌────────┐  │
│  │J. Smith │  │ │M. Jones │   │ │D. Brown │  │ │S. Lee  │  │
│  │42 Smith │  │ │15 Oak   │   │ │22 Main  │  │ │9 Park  │  │
│  │   92%   │  │ │   87%   │   │ │   85%   │  │ │  91%   │  │
│  └─────────┘  │ └─────────┘   │ └─────────┘  │ └────────┘  │
│  ┌─────────┐  │ ┌─────────┐   │ ┌─────────┐  │ ┌────────┐  │
│  │A. White │  │ │B. Green │   │ │E. Black │  │ │T. Gray │  │
│  │18 High  │  │ │7 Low St │   │ │33 River │  │ │5 Lake  │  │
│  │   78%   │  │ │   82%   │   │ │   79%   │  │ │  88%   │  │
│  └─────────┘  │ └─────────┘   │ └─────────┘  │ └────────┘  │
│       ⋮       │      ⋮        │      ⋮       │     ⋮       │
│               │               │              │             │
│  [+ Add Lead] │               │              │             │
│               │               │              │             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Phase 1 Build Order

### Week 1-2: Foundation
1. **Project scaffold** - Next.js + TypeScript + Tailwind
2. **Firebase integration** - Auth wrapper, Firestore setup
3. **Data models** - TypeScript interfaces, Firestore rules
4. **Base API routes** - Auth middleware, error handling
5. **Config system** - JSON config loading, admin API

### Week 3-4: Core Features
6. **Facebook webhook** - Endpoint, raw storage, dedup logic
7. **Leads CRUD** - API + basic UI
8. **Lead profile** - Unified view component
9. **Activities/Timeline** - API + UI component
10. **Pipeline stages** - Config-driven stage management

### Week 5-6: Tables & Views
11. **Leads table** - Filterable, sortable, configurable columns
12. **Bulk actions** - Select, assign, move, export
13. **Pipeline kanban** - Drag-drop, quick actions
14. **Property integration** - Link leads to properties

### Week 7-8: Polish & Migration
15. **Sheets import** - One-time + optional sync
16. **Dashboard** - Mirror app experience
17. **EAL section** - Locked premium view
18. **Settings screens** - Pipeline, scripts, team
19. **Roles & permissions** - Access control enforcement
20. **Testing & deployment** - DigitalOcean setup

---

## 6. Config vs Code Separation

### Stored in Config (CEO-Editable)

| Item | Storage | Editor |
|------|---------|--------|
| Pipeline stages | Firestore `config/pipeline` | Admin UI |
| SMS templates | Firestore `config/scripts` | Admin UI |
| Email templates | Firestore `config/scripts` | Admin UI |
| Call scripts | Firestore `config/scripts` | Admin UI |
| Automation rules | Firestore `config/rules` | Admin UI |
| Upsell copy | Firestore `config/copy` | Admin UI |
| Empty state text | Firestore `config/copy` | Admin UI |

### Stored in Code (Dev-Only)

| Item | Location | Reason |
|------|----------|--------|
| Data schemas | `src/types/` | Type safety |
| API routes | `src/app/api/` | Security |
| UI components | `src/components/` | UX consistency |
| Auth logic | `src/lib/auth/` | Security critical |
| Webhook handlers | `src/app/api/leads/facebook/` | Idempotency logic |
| Permission rules | `src/lib/permissions/` | Security critical |

### Fallback: JSON Config Files

For emergency CEO edits without database access:

```
/config
  /pipeline.json      # Stage definitions
  /scripts.json       # Templates
  /rules.json         # Automation rules
  /copy.json          # UI text
```

These are loaded at build time and can be overridden by Firestore values.

---

## 7. Security Considerations

### API Security
- All endpoints require authenticated Firebase token
- Role-based access control on sensitive endpoints
- Rate limiting on webhook endpoints (10k/min)
- Input validation on all user inputs

### Data Security
- Phone numbers stored in E.164 format
- Raw FB payloads encrypted at rest
- PII access logged for compliance
- Data retention policies enforced

### Webhook Security
- Facebook webhook verification token
- Request signature validation
- Idempotency keys for retry safety

---

## 8. Monitoring & Observability

### Key Metrics
- Webhook ingestion rate (target: 50k/month sustained)
- Webhook processing latency (target: <500ms p99)
- Lead deduplication rate
- Pipeline conversion rates per stage
- User engagement (DAU, session length)

### Alerts
- Webhook failures > 1% 
- Processing queue depth > 1000
- API error rate > 0.1%
- Auth failures spike

---

## 9. Future Considerations (Phase 2+)

1. **Automation engine** - Rule-based triggers and actions
2. **SLA tracking** - Response time targets per stage
3. **Reporting** - Conversion funnels, agent performance
4. **Mobile parity** - Ensure desktop features work on mobile
5. **API for integrations** - Public API for agent tools
6. **Audit logging** - Complete activity trail for compliance

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Author: Architecture Team*
