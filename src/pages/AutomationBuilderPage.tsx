import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, Play, Pause, Save, Plus, Zap, Mail, Clock,
    GitBranch, Tag, X, ChevronDown, Check, Pencil,
    MousePointer2, Trash2, Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    FlowNode, FlowEdge, FlowNodeType, FlowNodeData,
    TriggerNodeData, EmailNodeData, DelayNodeData,
    ConditionNodeData, TagNodeData, AutomationStatus,
} from '@/types/automation';

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_WIDTH = 248;
const NODE_HEIGHTS: Record<FlowNodeType, number> = {
    trigger: 104,
    email: 126,
    delay: 96,
    condition: 118,
    tag: 96,
    end: 68,
};

const NODE_STYLES: Record<FlowNodeType, { bg: string; border: string; icon: React.ElementType; label: string; accent: string }> = {
    trigger:   { bg: 'bg-emerald-50 dark:bg-emerald-950/40',  border: 'border-emerald-300 dark:border-emerald-700', icon: Zap,       label: 'Trigger',   accent: 'text-emerald-600 dark:text-emerald-400' },
    email:     { bg: 'bg-blue-50 dark:bg-blue-950/40',        border: 'border-blue-300 dark:border-blue-700',       icon: Mail,      label: 'Send email', accent: 'text-blue-600 dark:text-blue-400' },
    delay:     { bg: 'bg-amber-50 dark:bg-amber-950/40',      border: 'border-amber-300 dark:border-amber-700',     icon: Clock,     label: 'Wait',       accent: 'text-amber-600 dark:text-amber-400' },
    condition: { bg: 'bg-violet-50 dark:bg-violet-950/40',    border: 'border-violet-300 dark:border-violet-700',   icon: GitBranch, label: 'Condition',  accent: 'text-violet-600 dark:text-violet-400' },
    tag:       { bg: 'bg-rose-50 dark:bg-rose-950/40',        border: 'border-rose-300 dark:border-rose-700',       icon: Tag,       label: 'Tag',        accent: 'text-rose-600 dark:text-rose-400' },
    end:       { bg: 'bg-secondary',                           border: 'border-border',                              icon: X,         label: 'End',        accent: 'text-muted-foreground' },
};

function uid() { return `n-${Math.random().toString(36).slice(2, 9)}`; }
function euid() { return `e-${Math.random().toString(36).slice(2, 9)}`; }

// ── Default flow (Welcome Series) ─────────────────────────────────────────────

function buildDefaultFlow(): { nodes: FlowNode[]; edges: FlowEdge[] } {
    const cx = 320;
    const nodes: FlowNode[] = [
        { id: 'n1', type: 'trigger',   position: { x: cx, y: 60 },  data: { triggerType: 'list_signup', label: 'Joins any list' } as TriggerNodeData },
        { id: 'n2', type: 'delay',     position: { x: cx, y: 240 }, data: { amount: 0, unit: 'minutes' } as DelayNodeData },
        { id: 'n3', type: 'email',     position: { x: cx, y: 412 }, data: { subject: 'Welcome to the family 👋', preheader: 'Here\'s everything you need to get started', fromName: 'Marketing Team', fromEmail: 'marketing@company.com' } as EmailNodeData },
        { id: 'n4', type: 'delay',     position: { x: cx, y: 614 }, data: { amount: 2, unit: 'days' } as DelayNodeData },
        { id: 'n5', type: 'condition', position: { x: cx, y: 786 }, data: { field: 'opened_email', operator: 'is', value: 'true', label: 'Opened welcome email?' } as ConditionNodeData },
        { id: 'n6', type: 'email',     position: { x: cx - 175, y: 990 }, data: { subject: 'Quick tip to get you started', preheader: 'Your first step to success', fromName: 'Marketing Team', fromEmail: 'marketing@company.com' } as EmailNodeData },
        { id: 'n7', type: 'email',     position: { x: cx + 175, y: 990 }, data: { subject: 'Did you see our welcome email?', preheader: 'We wanted to make sure you got it', fromName: 'Marketing Team', fromEmail: 'marketing@company.com' } as EmailNodeData },
        { id: 'n8', type: 'end',       position: { x: cx - 175, y: 1192 }, data: {} },
        { id: 'n9', type: 'end',       position: { x: cx + 175, y: 1192 }, data: {} },
    ];
    const edges: FlowEdge[] = [
        { id: euid(), fromNodeId: 'n1', toNodeId: 'n2' },
        { id: euid(), fromNodeId: 'n2', toNodeId: 'n3' },
        { id: euid(), fromNodeId: 'n3', toNodeId: 'n4' },
        { id: euid(), fromNodeId: 'n4', toNodeId: 'n5' },
        { id: euid(), fromNodeId: 'n5', toNodeId: 'n6', branch: 'yes', label: 'Yes' },
        { id: euid(), fromNodeId: 'n5', toNodeId: 'n7', branch: 'no',  label: 'No' },
        { id: euid(), fromNodeId: 'n6', toNodeId: 'n8' },
        { id: euid(), fromNodeId: 'n7', toNodeId: 'n9' },
    ];
    return { nodes, edges };
}

// ── Port helpers ──────────────────────────────────────────────────────────────

function getOutputPort(node: FlowNode, branch?: 'yes' | 'no'): { x: number; y: number } {
    const h = NODE_HEIGHTS[node.type];
    const cx = node.position.x + NODE_WIDTH / 2;
    const by = node.position.y + h;
    if (node.type === 'condition') {
        if (branch === 'yes') return { x: node.position.x + NODE_WIDTH * 0.28, y: by };
        if (branch === 'no')  return { x: node.position.x + NODE_WIDTH * 0.72, y: by };
    }
    return { x: cx, y: by };
}

function getInputPort(node: FlowNode): { x: number; y: number } {
    return { x: node.position.x + NODE_WIDTH / 2, y: node.position.y };
}

function bezier(x1: number, y1: number, x2: number, y2: number): string {
    const dy = (y2 - y1) * 0.55;
    return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
}

// ── Node card ─────────────────────────────────────────────────────────────────

function NodeCard({ node, selected, onSelect, onDelete, onDragStart }: {
    node: FlowNode;
    selected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onDragStart: (e: React.MouseEvent, id: string) => void;
}) {
    const style = NODE_STYLES[node.type];
    const Icon = style.icon;
    const isEnd = node.type === 'end';
    const data = node.data as Record<string, unknown>;

    function getDescription(): string {
        switch (node.type) {
            case 'trigger': return (data.label as string) || 'When contact matches trigger';
            case 'email':   return (data.subject as string) || 'No subject set';
            case 'delay':   return `Wait ${data.amount} ${data.unit}`;
            case 'condition': return (data.label as string) || 'Check condition';
            case 'tag':     return `${data.action === 'add' ? 'Add' : 'Remove'} tag: ${data.tagName || '(none)'}`;
            default:        return 'End of flow';
        }
    }

    return (
        <div
            style={{ left: node.position.x, top: node.position.y, width: NODE_WIDTH, position: 'absolute' }}
            className={`rounded-xl border-2 ${style.border} ${style.bg} shadow-sm select-none transition-shadow ${selected ? 'ring-2 ring-primary ring-offset-1 shadow-lg' : 'hover:shadow-md'} ${isEnd ? 'border-dashed' : ''}`}
            onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
            onMouseDown={(e) => { e.stopPropagation(); onDragStart(e, node.id); }}
        >
            <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-background/60`}>
                            <Icon className={`h-3.5 w-3.5 ${style.accent}`} />
                        </div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${style.accent}`}>
                            {style.label}
                        </span>
                    </div>
                    {selected && !isEnd && (
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); }}
                            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                            className="rounded p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    )}
                </div>

                {!isEnd && (
                    <p className="text-sm font-medium text-foreground leading-tight truncate">
                        {getDescription()}
                    </p>
                )}

                {node.type === 'email' && (
                    <p className="text-[11px] text-muted-foreground mt-1 truncate">
                        From: {(data.fromName as string) || '—'}
                    </p>
                )}

                {node.type === 'condition' && (
                    <div className="flex gap-1 mt-2">
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">YES</span>
                        <span className="rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">NO</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Node properties panel ─────────────────────────────────────────────────────

function NodeProperties({ node, onChange, onClose }: {
    node: FlowNode;
    onChange: (id: string, data: FlowNodeData) => void;
    onClose: () => void;
}) {
    const data = node.data as Record<string, unknown>;

    function update(patch: Record<string, unknown>) {
        onChange(node.id, { ...node.data, ...patch } as FlowNodeData);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">
                        {NODE_STYLES[node.type].label} settings
                    </p>
                </div>
                <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-secondary">
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {node.type === 'trigger' && (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Trigger event</Label>
                            <Select value={(data.triggerType as string) || 'list_signup'} onValueChange={v => update({ triggerType: v })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="list_signup">Contact joins a list</SelectItem>
                                    <SelectItem value="tag_added">Tag is added</SelectItem>
                                    <SelectItem value="email_opened">Email is opened</SelectItem>
                                    <SelectItem value="email_clicked">Link is clicked</SelectItem>
                                    <SelectItem value="date_field">Date field matches</SelectItem>
                                    <SelectItem value="purchase">Purchase is made</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Label (optional)</Label>
                            <Input className="h-8 text-xs" value={(data.label as string) || ''} onChange={e => update({ label: e.target.value })} placeholder="e.g. Joins newsletter list" />
                        </div>
                    </>
                )}

                {node.type === 'email' && (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Subject line <span className="text-destructive">*</span></Label>
                            <Input className="h-8 text-xs" value={(data.subject as string) || ''} onChange={e => update({ subject: e.target.value })} placeholder="Your subject line…" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Preheader</Label>
                            <Input className="h-8 text-xs" value={(data.preheader as string) || ''} onChange={e => update({ preheader: e.target.value })} placeholder="Preview text…" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">From name</Label>
                            <Input className="h-8 text-xs" value={(data.fromName as string) || ''} onChange={e => update({ fromName: e.target.value })} placeholder="Your name" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">From email</Label>
                            <Input className="h-8 text-xs" value={(data.fromEmail as string) || ''} onChange={e => update({ fromEmail: e.target.value })} placeholder="you@example.com" />
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/30 p-3">
                            <p className="text-xs text-muted-foreground mb-2">Email template</p>
                            <button className="w-full rounded-md border border-dashed border-border bg-background py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                                + Design email template
                            </button>
                        </div>
                    </>
                )}

                {node.type === 'delay' && (
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Wait duration</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                className="h-8 text-xs w-20"
                                value={(data.amount as number) ?? 1}
                                min={0}
                                onChange={e => update({ amount: parseInt(e.target.value) || 0 })}
                            />
                            <Select value={(data.unit as string) || 'days'} onValueChange={v => update({ unit: v })}>
                                <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minutes">Minutes</SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                    <SelectItem value="weeks">Weeks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {node.type === 'condition' && (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Condition label</Label>
                            <Input className="h-8 text-xs" value={(data.label as string) || ''} onChange={e => update({ label: e.target.value })} placeholder="e.g. Opened welcome email?" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Check field</Label>
                            <Select value={(data.field as string) || 'opened_email'} onValueChange={v => update({ field: v })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="opened_email">Opened previous email</SelectItem>
                                    <SelectItem value="clicked_link">Clicked a link</SelectItem>
                                    <SelectItem value="has_tag">Has tag</SelectItem>
                                    <SelectItem value="custom_field">Custom field</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Branches</p>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">YES</span>
                                <span className="text-xs text-muted-foreground">— condition is true</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">NO</span>
                                <span className="text-xs text-muted-foreground">— condition is false</span>
                            </div>
                        </div>
                    </>
                )}

                {node.type === 'tag' && (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Action</Label>
                            <Select value={(data.action as string) || 'add'} onValueChange={v => update({ action: v })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">Add tag</SelectItem>
                                    <SelectItem value="remove">Remove tag</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Tag name</Label>
                            <Input className="h-8 text-xs" value={(data.tagName as string) || ''} onChange={e => update({ tagName: e.target.value })} placeholder="e.g. onboarded" />
                        </div>
                    </>
                )}

                {node.type === 'end' && (
                    <p className="text-xs text-muted-foreground">This is the end of the flow. Contacts exit the automation here.</p>
                )}
            </div>
        </div>
    );
}

// ── Node palette ──────────────────────────────────────────────────────────────

const PALETTE_ITEMS: { type: FlowNodeType; label: string; description: string }[] = [
    { type: 'email',     label: 'Send email',  description: 'Send an email to the contact' },
    { type: 'delay',     label: 'Wait',        description: 'Pause before the next step' },
    { type: 'condition', label: 'Condition',   description: 'Branch based on contact data' },
    { type: 'tag',       label: 'Tag',         description: 'Add or remove a tag' },
    { type: 'end',       label: 'End',         description: 'End of the flow' },
];

function NodePalette({ onAdd }: { onAdd: (type: FlowNodeType) => void }) {
    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add step</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {PALETTE_ITEMS.map(item => {
                    const s = NODE_STYLES[item.type];
                    const Icon = s.icon;
                    return (
                        <button
                            key={item.type}
                            onClick={() => onAdd(item.type)}
                            className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:border-primary/50 hover:bg-secondary/50 ${s.border} ${s.bg}`}
                        >
                            <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-background/60 shrink-0 mt-0.5`}>
                                <Icon className={`h-3.5 w-3.5 ${s.accent}`} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Canvas ────────────────────────────────────────────────────────────────────

function FlowCanvas({ nodes, edges, selectedNodeId, onSelectNode, onDeleteNode, onNodeMove }: {
    nodes: FlowNode[];
    edges: FlowEdge[];
    selectedNodeId: string | null;
    onSelectNode: (id: string | null) => void;
    onDeleteNode: (id: string) => void;
    onNodeMove: (id: string, pos: { x: number; y: number }) => void;
}) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{ nodeId: string; startNode: { x: number; y: number }; startMouse: { x: number; y: number } } | null>(null);

    const handleDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;
        e.preventDefault();
        dragRef.current = {
            nodeId,
            startNode: { ...node.position },
            startMouse: { x: e.clientX, y: e.clientY },
        };
    }, [nodes]);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (!dragRef.current) return;
            const dx = e.clientX - dragRef.current.startMouse.x;
            const dy = e.clientY - dragRef.current.startMouse.y;
            onNodeMove(dragRef.current.nodeId, {
                x: Math.max(0, dragRef.current.startNode.x + dx),
                y: Math.max(0, dragRef.current.startNode.y + dy),
            });
        }
        function handleMouseUp() { dragRef.current = null; }
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [onNodeMove]);

    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

    // Calculate SVG canvas bounds
    const svgW = 900;
    const svgH = 1400;

    return (
        <div
            ref={canvasRef}
            className="flex-1 overflow-auto bg-[hsl(var(--canvas))]"
            onClick={() => onSelectNode(null)}
            style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }}
        >
            <div style={{ position: 'relative', width: svgW, minHeight: svgH, margin: '0 auto' }}>
                {/* SVG edges layer */}
                <svg
                    style={{ position: 'absolute', top: 0, left: 0, width: svgW, height: svgH, pointerEvents: 'none', zIndex: 0 }}
                >
                    <defs>
                        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                            <polygon points="0 0, 8 3.5, 0 7" fill="hsl(var(--muted-foreground))" opacity="0.6" />
                        </marker>
                        <marker id="arrow-yes" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                            <polygon points="0 0, 8 3.5, 0 7" fill="#10B981" opacity="0.8" />
                        </marker>
                        <marker id="arrow-no" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                            <polygon points="0 0, 8 3.5, 0 7" fill="#F43F5E" opacity="0.8" />
                        </marker>
                    </defs>

                    {edges.map(edge => {
                        const fromNode = nodeMap[edge.fromNodeId];
                        const toNode   = nodeMap[edge.toNodeId];
                        if (!fromNode || !toNode) return null;

                        const from = getOutputPort(fromNode, edge.branch);
                        const to   = getInputPort(toNode);
                        const path = bezier(from.x, from.y, to.x, to.y);
                        const isYes = edge.branch === 'yes';
                        const isNo  = edge.branch === 'no';
                        const stroke = isYes ? '#10B981' : isNo ? '#F43F5E' : 'hsl(var(--muted-foreground))';
                        const marker = isYes ? 'url(#arrow-yes)' : isNo ? 'url(#arrow-no)' : 'url(#arrow)';

                        // Midpoint for label
                        const midX = (from.x + to.x) / 2;
                        const midY = (from.y + to.y) / 2;

                        return (
                            <g key={edge.id}>
                                <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeOpacity="0.6" markerEnd={marker} />
                                {edge.label && (
                                    <g>
                                        <rect x={midX - 16} y={midY - 9} width={32} height={18} rx={9} fill={isYes ? '#D1FAE5' : '#FFE4E6'} />
                                        <text x={midX} y={midY + 4.5} textAnchor="middle" fontSize="10" fontWeight="700" fill={isYes ? '#065F46' : '#9F1239'}>
                                            {edge.label}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Node cards */}
                {nodes.map(node => (
                    <NodeCard
                        key={node.id}
                        node={node}
                        selected={selectedNodeId === node.id}
                        onSelect={onSelectNode}
                        onDelete={onDeleteNode}
                        onDragStart={handleDragStart}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_BADGES: Record<AutomationStatus, string> = {
    active:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    paused:   'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    draft:    'bg-secondary text-muted-foreground',
    archived: 'bg-secondary/50 text-muted-foreground/60',
};

// ── Main builder page ─────────────────────────────────────────────────────────

export default function AutomationBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const recipe = searchParams.get('recipe');

    const [automationName, setAutomationName] = useState(
        id === 'new'
            ? recipe === 'welcome' ? 'Welcome Series'
                : recipe === 'abandoned-cart' ? 'Abandoned Cart'
                    : recipe === 'birthday' ? 'Birthday Reward'
                        : recipe === 'winback' ? 'Win-back Campaign'
                            : recipe === 'post-purchase' ? 'Post-purchase Follow-up'
                                : recipe === 'lead-nurture' ? 'Lead Nurture'
                                    : 'New Automation'
            : 'Welcome Series'
    );
    const [editingName, setEditingName] = useState(false);
    const [status, setStatus] = useState<AutomationStatus>('draft');
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const { nodes: defaultNodes, edges: defaultEdges } = buildDefaultFlow();
    const [nodes, setNodes] = useState<FlowNode[]>(defaultNodes);
    const [edges, setEdges] = useState<FlowEdge[]>(defaultEdges);

    const selectedNode = nodes.find(n => n.id === selectedNodeId) ?? null;

    const handleNodeMove = useCallback((nodeId: string, pos: { x: number; y: number }) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, position: pos } : n));
    }, []);

    const handleNodeDataChange = useCallback((nodeId: string, data: FlowNodeData) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, data } : n));
    }, []);

    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes(prev => prev.filter(n => n.id !== nodeId));
        setEdges(prev => prev.filter(e => e.fromNodeId !== nodeId && e.toNodeId !== nodeId));
        setSelectedNodeId(null);
    }, []);

    const handleAddNode = useCallback((type: FlowNodeType) => {
        const lastNode = nodes[nodes.length - 1];
        const y = lastNode ? lastNode.position.y + NODE_HEIGHTS[lastNode.type] + 100 : 60;
        const x = lastNode ? lastNode.position.x : 320;

        const defaultData: FlowNodeData = type === 'email'
            ? { subject: '', preheader: '', fromName: 'Marketing Team', fromEmail: 'marketing@company.com' } as EmailNodeData
            : type === 'delay'
                ? { amount: 1, unit: 'days' } as DelayNodeData
                : type === 'condition'
                    ? { field: 'opened_email', operator: 'is', value: 'true', label: 'Check condition' } as ConditionNodeData
                    : type === 'tag'
                        ? { action: 'add', tagName: '' } as TagNodeData
                        : {} as Record<string, never>;

        const newNode: FlowNode = { id: uid(), type, position: { x, y }, data: defaultData };
        setNodes(prev => [...prev, newNode]);

        // Auto-connect to previous last node if it's not already an end
        if (lastNode && lastNode.type !== 'end') {
            setEdges(prev => [...prev, { id: euid(), fromNodeId: lastNode.id, toNodeId: newNode.id }]);
        }
        setSelectedNodeId(newNode.id);
    }, [nodes]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }, []);

    const handleActivate = useCallback(() => {
        setStatus(s => s === 'active' ? 'paused' : 'active');
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* ── Top bar ── */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => navigate('/automations')}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Automations
                    </button>
                    <div className="h-4 w-px bg-border" />

                    {editingName ? (
                        <input
                            autoFocus
                            className="text-sm font-semibold text-foreground bg-transparent border-0 outline-none border-b border-primary min-w-0 max-w-[280px]"
                            value={automationName}
                            onChange={e => setAutomationName(e.target.value)}
                            onBlur={() => setEditingName(false)}
                            onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                        />
                    ) : (
                        <button
                            onClick={() => setEditingName(true)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors min-w-0"
                        >
                            <span className="truncate max-w-[240px]">{automationName}</span>
                            <Pencil className="h-3 w-3 text-muted-foreground shrink-0" />
                        </button>
                    )}

                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGES[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {saved ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Save className="h-3.5 w-3.5" />}
                        {isSaving ? 'Saving…' : saved ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                        size="sm"
                        className={`h-7 text-xs gap-1.5 ${status === 'active' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}
                        onClick={handleActivate}
                    >
                        {status === 'active'
                            ? <><Pause className="h-3.5 w-3.5" />Pause</>
                            : <><Play className="h-3.5 w-3.5" />Activate</>
                        }
                    </Button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left palette */}
                <div className="w-56 shrink-0 border-r border-border bg-card overflow-hidden flex flex-col">
                    <NodePalette onAdd={handleAddNode} />
                </div>

                {/* Canvas */}
                <FlowCanvas
                    nodes={nodes}
                    edges={edges}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={setSelectedNodeId}
                    onDeleteNode={handleDeleteNode}
                    onNodeMove={handleNodeMove}
                />

                {/* Right properties */}
                <div className={`shrink-0 border-l border-border bg-card overflow-hidden flex flex-col transition-all duration-200 ${selectedNode ? 'w-72' : 'w-0'}`}>
                    {selectedNode && (
                        <NodeProperties
                            node={selectedNode}
                            onChange={handleNodeDataChange}
                            onClose={() => setSelectedNodeId(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}