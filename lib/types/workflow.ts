/**
 * TypeScript types for workflow/automation system
 */

// Step types
export type StepType = "condition" | "action" | "delay";

// Condition types
export type ConditionType = 
  | "email_exists"
  | "phone_exists"
  | "form_field_equals"
  | "form_field_greater_than";

// Action types
export type ActionType = 
  | "send_email"
  | "send_whatsapp"
  | "send_sms";

// Execution status
export type ExecutionStatus = "running" | "completed" | "stopped" | "failed";

// Log status
export type LogStatus = "success" | "failed" | "skipped";

// Step configuration interfaces
export interface ConditionConfig {
  condition_type: ConditionType;
  field_name?: string; // For form_field_equals, form_field_greater_than
  expected_value?: any; // For form_field_equals
  threshold?: number; // For form_field_greater_than
}

export interface ActionConfig {
  action_type: ActionType;
  template_id?: string;
}

export interface DelayConfig {
  seconds: number;
}

export type StepConfig = ConditionConfig | ActionConfig | DelayConfig;

// Step interface
export interface AutomationStep {
  id?: string;
  automation_id?: string;
  order: number;
  type: StepType;
  config: StepConfig;
}

// Automation interface
export interface Automation {
  id: string;
  org_id: string;
  name: string;
  trigger_event: string;
  is_active: boolean;
  created_at: string;
  steps?: AutomationStep[];
}

// Execution log interface
export interface ExecutionLog {
  id: string;
  execution_id: string;
  step_order: number;
  status: LogStatus;
  message: string | null;
  created_at: string;
}

// Execution interface
export interface AutomationExecution {
  id: string;
  automation_id: string;
  entity_id: string; // lead_id from Laravel
  status: ExecutionStatus;
  current_step: number;
  started_at: string;
  finished_at: string | null;
  event_id: string | null;
  logs?: ExecutionLog[];
}

// Create/Update automation payload
export interface AutomationCreatePayload {
  name: string;
  trigger_event: string;
  steps: Omit<AutomationStep, "id" | "automation_id">[];
}

export interface AutomationUpdatePayload {
  name?: string;
  trigger_event?: string;
  is_active?: boolean;
  steps?: Omit<AutomationStep, "id" | "automation_id">[];
}
