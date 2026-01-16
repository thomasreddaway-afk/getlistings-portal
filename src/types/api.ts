/**
 * Get Listings Portal - API Types
 * 
 * Request/Response types for all API endpoints.
 */

import { 
  Lead, 
  Property, 
  Opportunity, 
  Activity, 
  User,
  LeadSource,
  ActivityType,
  ActivityMetadata,
} from './entities';
import { PipelineStage } from './config';

// =============================================================================
// COMMON
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  next_cursor?: string;
  has_more: boolean;
  total_count?: number;
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

// =============================================================================
// FACEBOOK WEBHOOK
// =============================================================================

/**
 * Facebook Lead Ads webhook payload
 * This is the exact structure Facebook sends
 */
export interface FacebookWebhookPayload {
  object: 'page';
  entry: FacebookWebhookEntry[];
}

export interface FacebookWebhookEntry {
  id: string;
  time: number;
  changes: FacebookWebhookChange[];
}

export interface FacebookWebhookChange {
  field: 'leadgen';
  value: {
    form_id: string;
    leadgen_id: string;           // This is the facebook_lead_id
    created_time: number;
    page_id: string;
    ad_id?: string;
    adgroup_id?: string;
  };
}

/**
 * Response to Facebook webhook
 */
export interface FacebookWebhookResponse {
  success: boolean;
  received_count: number;
  message?: string;
}

/**
 * Facebook Lead data (fetched via Graph API)
 */
export interface FacebookLeadData {
  id: string;
  created_time: string;
  field_data: Array<{
    name: string;
    values: string[];
  }>;
  form_id: string;
  ad_id?: string;
  adset_id?: string;
  campaign_id?: string;
}

// =============================================================================
// LEADS API
// =============================================================================

export interface GetLeadsParams extends PaginationParams {
  // Filters
  is_exclusive?: boolean;
  stage_id?: string;
  assigned_agent_id?: string;
  source?: LeadSource;
  created_after?: string;
  created_before?: string;
  search?: string;
  has_property?: boolean;
  seller_score_min?: number;
  seller_score_max?: number;
  
  // Sorting
  sort_by?: 'created_at' | 'updated_at' | 'seller_score' | 'name' | 'last_activity_at';
  sort_order?: 'asc' | 'desc';
}

export interface GetLeadsResponse extends PaginatedResponse<Lead> {
  // Aggregations for filters
  aggregations?: {
    by_stage: Record<string, number>;
    by_source: Record<string, number>;
    total_exclusive: number;
    total_non_exclusive: number;
  };
}

export interface GetLeadDetailResponse {
  lead: Lead;
  property?: Property;
  opportunity?: Opportunity;
  recent_activities: Activity[];
  assigned_agent?: Pick<User, 'id' | 'first_name' | 'last_name' | 'phone' | 'avatar_url'>;
}

export interface CreateLeadRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  source?: LeadSource;
  is_exclusive?: boolean;
  property_address?: string;
  assigned_agent_id?: string;
}

export interface UpdateLeadRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_exclusive?: boolean;
  assigned_agent_id?: string;
  property_address?: string;
}

export type BulkLeadAction = 'assign' | 'move_stage' | 'delete' | 'export' | 'mark_exclusive';

export interface BulkLeadActionRequest {
  lead_ids: string[];
  action: BulkLeadAction;
  params?: {
    assigned_agent_id?: string;
    stage_id?: string;
    is_exclusive?: boolean;
  };
}

export interface BulkLeadActionResponse {
  success_count: number;
  failed_count: number;
  failed_ids?: string[];
  errors?: Array<{ id: string; error: string }>;
}

// =============================================================================
// PROPERTIES API
// =============================================================================

export interface GetPropertiesParams extends PaginationParams {
  search?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  seller_score_min?: number;
  seller_score_max?: number;
  has_linked_lead?: boolean;
  sort_by?: 'seller_score' | 'updated_at' | 'address';
  sort_order?: 'asc' | 'desc';
}

export interface GetPropertyDetailResponse {
  property: Property;
  linked_leads: Lead[];
  opportunities: Opportunity[];
}

export interface LinkPropertyRequest {
  lead_id: string;
  property_id?: string;
  address?: string;               // If property_id not provided, search/create by address
}

// =============================================================================
// PIPELINE API
// =============================================================================

export interface GetStagesResponse {
  stages: Array<PipelineStage & {
    count: number;
    total_value?: number;
  }>;
}

export interface MoveOpportunityRequest {
  opportunity_id: string;
  to_stage_id: string;
  note?: string;
}

export interface GetKanbanResponse {
  columns: KanbanColumn[];
}

export interface KanbanColumn {
  stage: PipelineStage;
  count: number;
  total_value?: number;
  opportunities: KanbanCard[];
}

export interface KanbanCard {
  opportunity: Opportunity;
  lead: Lead;
  property?: Property;
}

// =============================================================================
// ACTIVITIES API
// =============================================================================

export interface GetActivitiesParams extends PaginationParams {
  type?: ActivityType;
  created_after?: string;
  created_before?: string;
}

export interface CreateActivityRequest {
  lead_id: string;
  opportunity_id?: string;
  type: ActivityType;
  content: string;
  metadata?: ActivityMetadata;
}

// =============================================================================
// CONFIG API
// =============================================================================

export interface UpdateConfigRequest<T = unknown> {
  data: T;
  version: number;                // For optimistic locking
}

export interface UpdateConfigResponse {
  success: boolean;
  version: number;
}

// =============================================================================
// IMPORT API
// =============================================================================

export interface SheetsImportRequest {
  spreadsheet_id: string;
  sheet_name: string;
  column_mapping: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    address?: string;
    stage?: string;
    notes?: string;
    [key: string]: string | undefined;
  };
  options: {
    skip_duplicates: boolean;
    default_stage_id: string;
    is_exclusive: boolean;
    assigned_agent_id?: string;
    start_row?: number;
    end_row?: number;
  };
}

export interface SheetsImportResponse {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ImportStatusResponse {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stats: {
    total_rows: number;
    processed_rows: number;
    imported_count: number;
    skipped_duplicates: number;
    error_count: number;
  };
  errors?: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
}

// =============================================================================
// AUTH API
// =============================================================================

export interface GetCurrentUserResponse {
  user: User;
  permissions: string[];
  feature_flags: Record<string, boolean>;
}

// =============================================================================
// DASHBOARD API
// =============================================================================

export interface GetDashboardResponse {
  // Summary stats
  stats: {
    total_leads: number;
    leads_this_week: number;
    leads_this_month: number;
    conversion_rate: number;
    
    // By stage
    leads_by_stage: Record<string, number>;
    
    // Exclusive vs non-exclusive
    exclusive_leads: number;
    app_leads: number;
  };
  
  // High-score properties
  hot_properties: Array<{
    property: Property;
    lead?: Lead;
  }>;
  
  // Recent activity
  recent_activities: Activity[];
  
  // AI insights
  ai_insights: Array<{
    type: 'opportunity' | 'risk' | 'action';
    title: string;
    description: string;
    property_id?: string;
    lead_id?: string;
  }>;
}
