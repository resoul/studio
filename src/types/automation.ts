export type AutomationStatus = 'active' | 'paused' | 'draft' | 'archived';

export type TriggerType =
    | 'list_signup'
    | 'tag_added'
    | 'email_opened'
    | 'email_clicked'
    | 'date_field'
    | 'api_call'
    | 'purchase'
    | 'manual';

export type WorkflowActionType =
    | 'send_email'
    | 'webhook'
    | 'update_contact'
    | 'add_to_list'
    | 'tag'
    | 'ai_task';

export type FlowNodeType =
    | 'trigger'
    | 'action'
    | 'delay'
    | 'match'
    | 'end';

export interface NodePosition {
    x: number;
    y: number;
}

export interface TriggerNodeData {
    triggerType: TriggerType;
    label: string;
    schedule: 'realtime' | 'hourly' | 'daily';
    processingLimit: 'unlimited' | '100' | '1000';
}

export interface ActionNodeData {
    actionType: WorkflowActionType;
    title: string;
    actor: string;
    object: string;
    description: string;
}

export interface DelayNodeData {
    amount: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
}

export type MatchOperator =
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'starts_with'
    | 'greater_than'
    | 'less_than'
    | 'exists';

export interface MatchRule {
    id: string;
    label: string;
    field: string;
    operator: MatchOperator;
    value: string;
}

export interface MatchNodeData {
    title: string;
    rules: MatchRule[];
    defaultLabel: string;
}

export type FlowNodeData =
    | TriggerNodeData
    | ActionNodeData
    | DelayNodeData
    | MatchNodeData
    | Record<string, never>;

export interface FlowNode {
    id: string;
    type: FlowNodeType;
    position: NodePosition;
    data: FlowNodeData;
}

export interface FlowEdge {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    branchId?: string;
    label?: string;
}

export interface WorkflowRuntimeSettings {
    queueMode: 'sequential' | 'parallel';
    retries: number;
    retryBackoff: 'fixed' | 'exponential';
    timeoutSeconds: number;
    paused: boolean;
}

export interface AutomationFlow {
    id: string;
    name: string;
    status: AutomationStatus;
    runtime: WorkflowRuntimeSettings;
    nodes: FlowNode[];
    edges: FlowEdge[];
    createdAt: string;
    updatedAt: string;
}

export interface AutomationSummary {
    id: string;
    name: string;
    status: AutomationStatus;
    trigger: string;
    enrolled: number;
    completed: number;
    emailsSent: number;
    openRate: number;
    createdAt: string;
}

export interface RecipeTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    trigger: string;
    steps: number;
    avgOpenRate: string;
    tags: string[];
}
