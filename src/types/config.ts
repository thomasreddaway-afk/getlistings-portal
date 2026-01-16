/**
 * Get Listings Portal - Configuration Types
 * 
 * These types define the CEO-editable configuration schemas.
 * All config is stored in Firestore and can be modified via Admin UI.
 */

import { Timestamp } from 'firebase/firestore';

// =============================================================================
// CONFIG WRAPPER
// =============================================================================

export type ConfigType = 'pipeline' | 'scripts' | 'rules' | 'copy';

export interface Config<T = unknown> {
  id: ConfigType;
  data: T;
  updated_by_id: string;
  updated_at: Timestamp;
  version: number;                  // For optimistic locking
}

// =============================================================================
// PIPELINE CONFIGURATION
// =============================================================================

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;                    // Tailwind color class or hex
  description?: string;
  
  // Terminal stages (won/lost)
  is_terminal: boolean;
  terminal_type?: 'won' | 'lost';
  
  // Automation triggers
  auto_actions?: string[];          // Rule IDs to trigger on stage entry
  
  // SLA configuration
  sla_hours?: number;               // Hours before SLA breach
}

export interface PipelineConfig {
  stages: PipelineStage[];
  default_stage_id: string;
  
  // Display settings
  show_value_in_kanban?: boolean;
  show_score_in_kanban?: boolean;
}

/**
 * Default pipeline configuration (used as fallback)
 */
export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  stages: [
    { id: 'lead', name: 'Lead', order: 1, color: 'stage-lead', is_terminal: false, sla_hours: 24 },
    { id: 'qualified', name: 'Qualified Lead', order: 2, color: 'stage-qualified', is_terminal: false, sla_hours: 48 },
    { id: 'contact', name: 'Contact Made', order: 3, color: 'stage-contact', is_terminal: false, sla_hours: 72 },
    { id: 'appointment', name: 'Appointment', order: 4, color: 'stage-appointment', is_terminal: false },
    { id: 'listing', name: 'Listing', order: 5, color: 'stage-listing', is_terminal: false },
    { id: 'sale', name: 'Sale', order: 6, color: 'stage-sale', is_terminal: true, terminal_type: 'won' },
    { id: 'lost', name: 'Lost', order: 7, color: 'stage-lost', is_terminal: true, terminal_type: 'lost' },
  ],
  default_stage_id: 'lead',
  show_value_in_kanban: true,
  show_score_in_kanban: true,
};

// =============================================================================
// SCRIPTS/TEMPLATES CONFIGURATION
// =============================================================================

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;                  // Supports variables: {{first_name}}, {{property_address}}, etc.
  
  // Categorization
  category?: string;
  stage_id?: string;                // Suggested for this stage
  
  // Metadata
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplate extends MessageTemplate {
  subject: string;
  
  // Rich content
  html_content?: string;
  
  // Attachments
  attachment_ids?: string[];
}

export interface CallScript {
  id: string;
  name: string;
  content: string;                  // Markdown supported
  
  // Structure
  sections?: CallScriptSection[];
  
  // Categorization
  stage_id?: string;
  scenario?: string;                // e.g., "First contact", "Follow-up", "Objection handling"
  
  is_active: boolean;
}

export interface CallScriptSection {
  title: string;
  content: string;
  order: number;
}

export interface ScriptsConfig {
  sms_templates: MessageTemplate[];
  email_templates: EmailTemplate[];
  call_scripts: CallScript[];
  
  // Default templates for common actions
  defaults: {
    first_contact_sms?: string;     // Template ID
    appointment_confirmation?: string;
    appraisal_email?: string;
  };
}

/**
 * Available template variables
 */
export const TEMPLATE_VARIABLES = [
  { key: 'first_name', description: 'Lead first name', example: 'John' },
  { key: 'last_name', description: 'Lead last name', example: 'Smith' },
  { key: 'full_name', description: 'Lead full name', example: 'John Smith' },
  { key: 'property_address', description: 'Property address', example: '42 Smith St, Richmond' },
  { key: 'suburb', description: 'Property suburb', example: 'Richmond' },
  { key: 'seller_score', description: 'Seller likelihood score', example: '87%' },
  { key: 'agent_name', description: 'Assigned agent name', example: 'Sarah Thompson' },
  { key: 'agent_phone', description: 'Assigned agent phone', example: '0412 345 678' },
  { key: 'agency_name', description: 'Agency name', example: 'Ray White Richmond' },
  { key: 'appointment_date', description: 'Appointment date', example: '15 January 2026' },
  { key: 'appointment_time', description: 'Appointment time', example: '2:30 PM' },
] as const;

// =============================================================================
// AUTOMATION RULES CONFIGURATION
// =============================================================================

export type RuleTriggerType = 
  | 'new_lead' 
  | 'stage_enter' 
  | 'stage_exit'
  | 'inactivity' 
  | 'score_change'
  | 'property_linked'
  | 'appointment_scheduled';

export type RuleActionType = 
  | 'notify' 
  | 'assign' 
  | 'move_stage'
  | 'add_tag'
  | 'send_sms'
  | 'send_email'
  | 'create_task'
  | 'webhook';

export interface RuleCondition {
  field: string;                    // e.g., 'seller_score', 'source', 'is_exclusive'
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'is_set' | 'is_not_set';
  value: unknown;
}

export interface RuleTrigger {
  type: RuleTriggerType;
  conditions?: RuleCondition[];
  
  // Type-specific config
  stage_id?: string;                // For stage_enter/exit
  inactivity_hours?: number;        // For inactivity trigger
  score_threshold?: number;         // For score_change
}

export interface RuleAction {
  type: RuleActionType;
  
  // Action parameters
  params: {
    // notify
    notify_user_ids?: string[];
    notify_channel?: 'email' | 'sms' | 'push';
    notify_message?: string;
    
    // assign
    assign_to_user_id?: string;
    assign_round_robin?: boolean;
    
    // move_stage
    target_stage_id?: string;
    
    // add_tag
    tag?: string;
    
    // send_sms / send_email
    template_id?: string;
    
    // create_task
    task_title?: string;
    task_due_hours?: number;
    
    // webhook
    webhook_url?: string;
    webhook_payload?: Record<string, unknown>;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  
  trigger: RuleTrigger;
  actions: RuleAction[];
  
  // Constraints
  run_once_per_lead?: boolean;
  priority?: number;                // Higher runs first
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  last_triggered_at?: string;
  trigger_count?: number;
}

export interface RulesConfig {
  rules: AutomationRule[];
  
  // Global settings
  rules_enabled: boolean;           // Master switch
  max_actions_per_lead_per_day?: number;
}

// =============================================================================
// UI COPY CONFIGURATION
// =============================================================================

export interface UpsellCopy {
  headline: string;
  body: string;
  cta_text: string;
  cta_url?: string;
}

export interface StageEmptyState {
  title: string;
  body: string;
  action_text?: string;
  action_url?: string;
}

export interface CopyConfig {
  // Upsell copy
  upsells: {
    eal_banner: UpsellCopy;
    eal_locked_section: UpsellCopy;
    app_upsell_from_eal: UpsellCopy;
    upgrade_prompt: UpsellCopy;
  };
  
  // Empty states per stage
  stage_empty_states: Record<string, StageEmptyState>;
  
  // Generic empty states
  empty_states: {
    no_leads: StageEmptyState;
    no_properties: StageEmptyState;
    no_activities: StageEmptyState;
    no_search_results: StageEmptyState;
  };
  
  // Onboarding
  onboarding: {
    welcome_headline: string;
    welcome_body: string;
    steps: Array<{
      title: string;
      description: string;
      action_text?: string;
    }>;
  };
  
  // Misc UI text
  labels: Record<string, string>;
}

/**
 * Default copy configuration
 */
export const DEFAULT_COPY_CONFIG: Partial<CopyConfig> = {
  upsells: {
    eal_banner: {
      headline: 'Want exclusive appraisal-ready sellers?',
      body: 'Get done-for-you leads instead of shared insights. Our team generates and qualifies leads for you.',
      cta_text: 'Learn More',
    },
    eal_locked_section: {
      headline: 'Exclusive Appraisal Leads',
      body: 'Access qualified, exclusive seller leads generated by our team. No sharing, no cold calling.',
      cta_text: 'Upgrade Now',
    },
    app_upsell_from_eal: {
      headline: 'Unlock deeper insights',
      body: 'Get AI-powered seller predictions and property data for your entire market.',
      cta_text: 'Explore Get Listings',
    },
    upgrade_prompt: {
      headline: 'Upgrade your plan',
      body: 'Get access to premium features and exclusive leads.',
      cta_text: 'View Plans',
    },
  },
  empty_states: {
    no_leads: {
      title: 'No leads yet',
      body: 'Leads will appear here as they come in from Facebook or when you add them manually.',
      action_text: 'Add Lead',
    },
    no_properties: {
      title: 'No properties',
      body: 'Search for a property or link one to a lead to get started.',
      action_text: 'Search Properties',
    },
    no_activities: {
      title: 'No activity yet',
      body: 'Activities like calls, emails, and notes will appear here.',
    },
    no_search_results: {
      title: 'No results found',
      body: 'Try adjusting your search or filters.',
    },
  },
};

// =============================================================================
// COMBINED CONFIG TYPE
// =============================================================================

export type ConfigData = 
  | PipelineConfig 
  | ScriptsConfig 
  | RulesConfig 
  | CopyConfig;

export interface AllConfigs {
  pipeline: Config<PipelineConfig>;
  scripts: Config<ScriptsConfig>;
  rules: Config<RulesConfig>;
  copy: Config<CopyConfig>;
}
