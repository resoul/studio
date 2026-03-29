import { LucideIcon } from "lucide-react";

export type NodeType =
    | "workflow"
    | "trigger"
    | "wait"
    | "ifelse"
    | "send_email"
    | "webhook"
    | "add_tag"
    | "notify"
    | "end";

export interface NodeConfig {
    triggerId?: string;
    amount?: number;
    unit?: string;
    field?: string;
    op?: string;
    value?: string;
    name?: string;
    subject?: string;
    url?: string;
    tag?: string;
    runs?: string;
    [key: string]: any;
}

export interface WorkflowNode {
    id: string;
    type: NodeType;
    config?: NodeConfig;
    triggers?: WorkflowNode[];
    next?: WorkflowNode;
    yes?: WorkflowNode | null;
    no?: WorkflowNode | null;
}

export interface TriggerOption {
    id: string;
    label: string;
    cat: string;
    Icon: LucideIcon;
}

export interface ActionOption {
    id: string;
    label: string;
    desc: string;
    tabs: string[];
    Icon: LucideIcon;
    bg: string;
    iconColor: string;
}
