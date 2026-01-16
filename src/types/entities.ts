/**
 * Get Listings Portal - Core Type Definitions
 * 
 * This file contains all core entity types used throughout the application.
 * These types map directly to Firestore documents.
 */

import { Timestamp } from 'firebase/firestore';

// =============================================================================
// LEAD - The central entity
// =============================================================================

export type LeadSource = 'facebook' | 'app' | 'import' | 'manual';

export interface Lead {
  id: string;
  
  // Identity
  first_name: string;
  last_name: string;
  phone: string;                    // PRIMARY IDENTITY (E.164 format: +61412345678)
  email?: string;
  
  // Source tracking
  source: LeadSource;
  facebook_lead_id?: string;        // For FB deduplication
  facebook_form_id?: string;
  facebook_ad_id?: string;
  
  // Execution mode - determines DIY vs DFY
  is_exclusive: boolean;            // true = EAL (agency-managed), false = DIY (app user)
  
  // Ownership
  assigned_agent_id?: string;
  created_by_id: string;
  
  // Raw data storage (for debugging/compliance)
  raw_payload?: Record<string, unknown>;
  
  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
  
  // Denormalized fields for query performance
  // These are duplicated from related entities to enable efficient querying
  property_address?: string;
  current_stage_id?: string;
  current_stage_name?: string;
  seller_score?: number;
  last_activity_at?: Timestamp;
  follow_up_count?: number;
  
  // Quick access flags
  appraisal_sent?: boolean;
  appointment_scheduled?: boolean;
}

/**
 * Create params for a new lead (omitting computed/auto fields)
 */
export interface CreateLeadParams {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  source?: LeadSource;
  is_exclusive?: boolean;
  property_address?: string;
  assigned_agent_id?: string;
  facebook_lead_id?: string;
  raw_payload?: Record<string, unknown>;
}

/**
 * Update params for modifying a lead
 */
export interface UpdateLeadParams {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_exclusive?: boolean;
  assigned_agent_id?: string;
  property_address?: string;
}

// =============================================================================
// PROPERTY - Linked to leads, carries prediction data
// =============================================================================

export type PropertyType = 'house' | 'apartment' | 'townhouse' | 'land' | 'other';
export type Country = 'AU' | 'NZ' | 'US';

export interface Property {
  id: string;
  
  // Address components (canonical, normalized)
  address: string;                  // Full formatted address
  unit_number?: string;
  street_number: string;
  street_name: string;
  suburb: string;
  state: string;
  postcode: string;
  country: Country;
  
  // Geocoding
  latitude?: number;
  longitude?: number;
  
  // Prediction data (from existing engine)
  seller_score: number;             // 0-100
  seller_score_updated_at: Timestamp;
  seller_score_trend?: 'rising' | 'stable' | 'falling';
  
  // Property metadata
  property_type?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  land_size_sqm?: number;
  building_size_sqm?: number;
  year_built?: number;
  
  // Links to leads
  linked_lead_ids: string[];
  
  // AI insights (from existing prediction engine)
  ai_insights?: PropertyAIInsights;
  
  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface PropertyAIInsights {
  motivation_signals: string[];
  recommended_approach?: string;
  estimated_value?: {
    low: number;
    mid: number;
    high: number;
    confidence: number;
  };
  comparable_sales?: ComparableSale[];
  market_trend?: 'hot' | 'warm' | 'neutral' | 'cool';
  days_on_market_estimate?: number;
}

export interface ComparableSale {
  address: string;
  sale_price: number;
  sale_date: string;
  bedrooms?: number;
  bathrooms?: number;
  land_size_sqm?: number;
  distance_km?: number;
}

// =============================================================================
// OPPORTUNITY - Pipeline position for lead+property
// =============================================================================

export type OpportunityOutcome = 'won' | 'lost' | 'stale';

export interface Opportunity {
  id: string;
  
  lead_id: string;
  property_id?: string;             // Optional - lead may not have property yet
  
  // Pipeline position (references config.pipeline_stages)
  stage_id: string;
  stage_entered_at: Timestamp;
  previous_stage_id?: string;
  
  // Execution mode (inherited from lead, can override)
  is_exclusive: boolean;
  
  // Ownership
  assigned_agent_id: string;
  
  // Tracking
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  expected_close_date?: Timestamp;
  expected_value?: number;
  
  // SLA tracking (for Phase 2)
  sla_due_at?: Timestamp;
  sla_breached?: boolean;
  
  // Outcome
  outcome?: OpportunityOutcome;
  outcome_reason?: string;
  closed_at?: Timestamp;
  actual_value?: number;
  
  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateOpportunityParams {
  lead_id: string;
  property_id?: string;
  stage_id: string;
  assigned_agent_id: string;
  is_exclusive?: boolean;
  expected_close_date?: Date;
  expected_value?: number;
}

// =============================================================================
// ACTIVITY - Timeline events for leads
// =============================================================================

export type ActivityType = 
  | 'call' 
  | 'sms' 
  | 'email' 
  | 'note' 
  | 'stage_change' 
  | 'appraisal_sent' 
  | 'appointment'
  | 'property_linked'
  | 'assignment_change'
  | 'system';

export type CallOutcome = 'answered' | 'voicemail' | 'no_answer' | 'busy' | 'callback_scheduled';

export interface Activity {
  id: string;
  
  lead_id: string;
  opportunity_id?: string;
  property_id?: string;
  
  type: ActivityType;
  
  // Content
  content: string;                  // Activity description or note content
  
  // Type-specific metadata
  metadata?: ActivityMetadata;
  
  // Who and when
  created_by_id: string;
  created_at: Timestamp;
}

export interface ActivityMetadata {
  // Call metadata
  call_duration_seconds?: number;
  call_outcome?: CallOutcome;
  call_direction?: 'inbound' | 'outbound';
  
  // Email metadata
  email_subject?: string;
  email_template_id?: string;
  
  // SMS metadata
  sms_template_id?: string;
  
  // Stage change metadata
  from_stage_id?: string;
  from_stage_name?: string;
  to_stage_id?: string;
  to_stage_name?: string;
  
  // Appointment metadata
  appointment_datetime?: Timestamp;
  appointment_type?: 'appraisal' | 'listing_presentation' | 'open_home' | 'other';
  appointment_location?: string;
  
  // Assignment change
  from_agent_id?: string;
  to_agent_id?: string;
  
  // Appraisal metadata
  appraisal_value?: number;
  appraisal_range_low?: number;
  appraisal_range_high?: number;
}

export interface CreateActivityParams {
  lead_id: string;
  opportunity_id?: string;
  type: ActivityType;
  content: string;
  metadata?: ActivityMetadata;
}

// =============================================================================
// USER - Extends existing Firebase auth
// =============================================================================

export type UserRole = 'agent' | 'staff' | 'admin';
export type SubscriptionTier = 'free' | 'pro' | 'agency';

export interface User {
  id: string;                       // Firebase Auth UID
  
  // Identity (phone is primary, matching existing auth)
  phone: string;
  email?: string;
  
  // Profile
  first_name: string;
  last_name: string;
  avatar_url?: string;
  
  // Role & access
  role: UserRole;
  permissions?: string[];           // Granular permissions for custom roles
  
  // For staff users - which agents they support
  linked_agent_ids?: string[];
  
  // Subscription (links to existing billing system)
  subscription_tier: SubscriptionTier;
  subscription_expires_at?: Timestamp;
  has_exclusive_access: boolean;    // EAL section visibility
  
  // Agency association
  agency_id?: string;
  agency_name?: string;
  
  // Settings/preferences
  preferences?: UserPreferences;
  
  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
  last_login_at?: Timestamp;
}

export interface UserPreferences {
  timezone?: string;
  date_format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  default_view?: 'dashboard' | 'leads' | 'pipeline';
  email_notifications?: boolean;
  sms_notifications?: boolean;
  leads_per_page?: number;
  kanban_columns_visible?: string[];
}

// =============================================================================
// RAW LEAD - Immutable storage for webhook payloads
// =============================================================================

export type RawLeadSource = 'facebook' | 'other';

export interface RawLead {
  id: string;
  
  source: RawLeadSource;
  source_id: string;                // facebook_lead_id or equivalent
  
  // Store unmodified webhook payload
  payload: Record<string, unknown>;
  
  // Processing status
  processed: boolean;
  processed_at?: Timestamp;
  processed_lead_id?: string;       // Reference to created Lead
  processing_error?: string;
  processing_attempts?: number;
  
  // Deduplication
  dedup_key: string;                // Composite key for dedup lookup
  
  received_at: Timestamp;
}

// =============================================================================
// IMPORT - Track bulk import operations
// =============================================================================

export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type ImportSource = 'google_sheets' | 'csv' | 'api';

export interface Import {
  id: string;
  
  source: ImportSource;
  source_reference?: string;        // Spreadsheet ID, filename, etc.
  
  status: ImportStatus;
  
  // Progress tracking
  total_rows: number;
  processed_rows: number;
  imported_count: number;
  skipped_duplicates: number;
  error_count: number;
  
  // Error details
  errors?: ImportError[];
  
  // Configuration used
  config: ImportConfig;
  
  // Who initiated
  created_by_id: string;
  
  // Timestamps
  started_at?: Timestamp;
  completed_at?: Timestamp;
  created_at: Timestamp;
}

export interface ImportConfig {
  column_mapping: Record<string, string>;
  skip_duplicates: boolean;
  default_stage_id: string;
  is_exclusive: boolean;
  assigned_agent_id?: string;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
}
