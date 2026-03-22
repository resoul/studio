export type AutomationStatus = 'active' | 'paused' | 'draft' | 'archived';

export type TriggerType =
    | 'list_signup'
    | 'tag_added'
    | 'email_opened'
    | 'email_clicked'
    | 'date_field'
    | 'api_call'
    | 'purchase';

export type FlowNodeType =
    | 'trigger'
    | 'email'
    | 'delay'
    | 'condition'
    | 'tag'
    | 'end';

export interface NodePosition { x: number; y: number; }

export interface TriggerNodeData {
    triggerType: TriggerType;
    listId?: string;
    tagName?: string;
    fieldKey?: string;
    label?: string;
}

export interface EmailNodeData {
    subject: string;
    preheader: string;
    fromName: string;
    fromEmail: string;
}

export interface DelayNodeData {
    amount: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
}

export type ConditionField = 'opened_email' | 'clicked_link' | 'has_tag' | 'custom_field';

export interface ConditionNodeData {
    field: ConditionField;
    operator: 'is' | 'is_not' | 'contains';
    value: string;
    label?: string;
}

export interface TagNodeData {
    action: 'add' | 'remove';
    tagName: string;
}

export type FlowNodeData =
    | TriggerNodeData
    | EmailNodeData
    | DelayNodeData
    | ConditionNodeData
    | TagNodeData
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
    label?: string;
    branch?: 'yes' | 'no';
}

export interface AutomationFlow {
    id: string;
    name: string;
    status: AutomationStatus;
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