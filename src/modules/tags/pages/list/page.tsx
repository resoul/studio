import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import {
    Tag,
    Plus,
    Search,
    Trash2,
    Pencil,
    X,
    Check,
    Copy,
    ChevronDown,
    ChevronUp,
    Users,
    Send,
    Zap,
    MoreHorizontal,
    Hash,
    Filter,
    SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PageHeader } from './page-header';
import { Content } from '@/layout/components/content';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ContactTag {
    id: string;
    name: string;
    color: string;
    description: string;
    contactCount: number;
    automationCount: number;
    campaignCount: number;
    createdAt: string;
    updatedAt: string;
}

type SortField = 'name' | 'contactCount' | 'createdAt';
type SortDir = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

// ── Constants ─────────────────────────────────────────────────────────────────

const TAG_COLORS = [
    '#4F46E5', // indigo
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#F97316', // orange
    '#EC4899', // pink
    '#84CC16', // lime
    '#14B8A6', // teal
    '#6366F1', // indigo-lighter
    '#64748B', // slate
];

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_TAGS: ContactTag[] = [
    {
        id: 't1',
        name: 'vip',
        color: '#F59E0B',
        description: 'High-value customers with premium subscriptions',
        contactCount: 430,
        automationCount: 3,
        campaignCount: 8,
        createdAt: '2025-01-10',
        updatedAt: '2026-03-20',
    },
    {
        id: 't2',
        name: 'new',
        color: '#10B981',
        description: 'Contacts who joined in the last 30 days',
        contactCount: 1120,
        automationCount: 2,
        campaignCount: 4,
        createdAt: '2025-02-01',
        updatedAt: '2026-03-24',
    },
    {
        id: 't3',
        name: 'cart_abandoned',
        color: '#EF4444',
        description: 'Contacts who left items in their cart without purchasing',
        contactCount: 892,
        automationCount: 1,
        campaignCount: 2,
        createdAt: '2025-01-15',
        updatedAt: '2026-03-22',
    },
    {
        id: 't4',
        name: 'lead',
        color: '#4F46E5',
        description: 'Qualified leads from marketing campaigns',
        contactCount: 2340,
        automationCount: 4,
        campaignCount: 12,
        createdAt: '2025-01-05',
        updatedAt: '2026-03-18',
    },
    {
        id: 't5',
        name: 'purchased',
        color: '#06B6D4',
        description: 'Contacts who completed at least one purchase',
        contactCount: 3180,
        automationCount: 2,
        campaignCount: 6,
        createdAt: '2025-01-08',
        updatedAt: '2026-03-21',
    },
    {
        id: 't6',
        name: 'newsletter',
        color: '#8B5CF6',
        description: 'Subscribed to the weekly newsletter digest',
        contactCount: 8920,
        automationCount: 1,
        campaignCount: 42,
        createdAt: '2025-01-01',
        updatedAt: '2026-03-25',
    },
    {
        id: 't7',
        name: 'beta_user',
        color: '#F97316',
        description: 'Early access program participants testing new features',
        contactCount: 156,
        automationCount: 0,
        campaignCount: 3,
        createdAt: '2025-03-01',
        updatedAt: '2026-03-10',
    },
    {
        id: 't8',
        name: 'churned',
        color: '#64748B',
        description: 'Customers who cancelled or did not renew',
        contactCount: 640,
        automationCount: 2,
        campaignCount: 1,
        createdAt: '2025-02-10',
        updatedAt: '2026-02-28',
    },
    {
        id: 't9',
        name: 'enterprise',
        color: '#14B8A6',
        description: 'Enterprise plan subscribers with dedicated support',
        contactCount: 87,
        automationCount: 1,
        campaignCount: 5,
        createdAt: '2025-01-20',
        updatedAt: '2026-03-15',
    },
    {
        id: 't10',
        name: 'referral',
        color: '#EC4899',
        description: 'Contacts acquired through the referral program',
        contactCount: 412,
        automationCount: 1,
        campaignCount: 2,
        createdAt: '2025-02-15',
        updatedAt: '2026-03-05',
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
    return `tag-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
                     icon: Icon,
                     label,
                     value,
                     sub,
                 }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
                {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
            </div>
        </div>
    );
}

// ── Color Picker ──────────────────────────────────────────────────────────────

function ColorPicker({
                         value,
                         onChange,
                     }: {
    value: string;
    onChange: (color: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        className="h-7 w-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        style={{
                            backgroundColor: color,
                            borderColor: value === color ? '#0F172A' : 'transparent',
                            boxShadow: value === color ? `0 0 0 2px ${color}40` : 'none',
                        }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Tag Form Modal ────────────────────────────────────────────────────────────

interface TagFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag?: ContactTag | null;
    existingNames: string[];
    onSave: (tag: ContactTag) => void;
}

function TagFormModal({
                          open,
                          onOpenChange,
                          tag,
                          existingNames,
                          onSave,
                      }: TagFormModalProps) {
    const isEdit = !!tag;
    const [name, setName] = useState(tag?.name ?? '');
    const [description, setDescription] = useState(tag?.description ?? '');
    const [color, setColor] = useState(tag?.color ?? TAG_COLORS[0]);
    const [errors, setErrors] = useState<{ name?: string }>({});

    // Sync state when tag prop changes
    const handleOpenChange = useCallback(
        (isOpen: boolean) => {
            if (isOpen) {
                setName(tag?.name ?? '');
                setDescription(tag?.description ?? '');
                setColor(tag?.color ?? TAG_COLORS[0]);
                setErrors({});
            }
            onOpenChange(isOpen);
        },
        [tag, onOpenChange],
    );

    const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        setName(val);
        setErrors((prev) => ({ ...prev, name: undefined }));
    }, []);

    const handleDescChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    }, []);

    const handleSubmit = useCallback(() => {
        const errs: { name?: string } = {};
        if (!name.trim()) errs.name = 'Tag name is required.';
        else {
            const taken = existingNames.filter((n) => !isEdit || n !== tag?.name);
            if (taken.includes(name.trim())) errs.name = `Tag "${name}" already exists.`;
        }
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        const now = new Date().toISOString().slice(0, 10);
        onSave({
            id: tag?.id ?? uid(),
            name: name.trim(),
            description: description.trim(),
            color,
            contactCount: tag?.contactCount ?? 0,
            automationCount: tag?.automationCount ?? 0,
            campaignCount: tag?.campaignCount ?? 0,
            createdAt: tag?.createdAt ?? now,
            updatedAt: now,
        });
        handleOpenChange(false);
    }, [name, description, color, existingNames, isEdit, tag, onSave, handleOpenChange]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span
                            className="flex h-6 w-6 items-center justify-center rounded-full"
                            style={{ backgroundColor: color }}
                        >
                            <Hash className="h-3 w-3 text-white" />
                        </span>
                        {isEdit ? 'Edit tag' : 'Create tag'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the tag name, description, or color.'
                            : 'Tags help you organize and filter contacts across your workspace.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="tag-name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">#</span>
                            <Input
                                id="tag-name"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="e.g. vip, cart_abandoned"
                                className={cn('pl-7 font-mono', errors.name && 'border-destructive')}
                                autoFocus
                            />
                        </div>
                        {errors.name ? (
                            <p className="text-xs text-destructive">{errors.name}</p>
                        ) : (
                            <p className="text-[11px] text-muted-foreground">
                                Lowercase, underscores allowed. Used in automations and filters.
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tag-desc">
                            Description{' '}
                            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="tag-desc"
                            value={description}
                            onChange={handleDescChange}
                            placeholder="What does this tag represent?"
                        />
                    </div>

                    <ColorPicker value={color} onChange={setColor} />

                    {/* Preview */}
                    <div className="rounded-lg border border-border bg-secondary/20 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Preview
                        </p>
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                                backgroundColor: hexToRgba(color, 0.12),
                                color,
                                border: `1px solid ${hexToRgba(color, 0.3)}`,
                            }}
                        >
                            <Hash className="h-3 w-3" />
                            {name || 'tag_name'}
                        </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {isEdit ? 'Save changes' : 'Create tag'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ── Tag Grid Card ─────────────────────────────────────────────────────────────

interface TagCardProps {
    tag: ContactTag;
    onEdit: (tag: ContactTag) => void;
    onDelete: (tag: ContactTag) => void;
    onCopy: (name: string) => void;
}

function TagCard({ tag, onEdit, onDelete, onCopy }: TagCardProps) {
    const handleEdit = useCallback(() => onEdit(tag), [onEdit, tag]);
    const handleDelete = useCallback(() => onDelete(tag), [onDelete, tag]);
    const handleCopy = useCallback(() => onCopy(tag.name), [onCopy, tag.name]);

    return (
        <div className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm">
            {/* Color bar */}
            <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
                style={{ backgroundColor: tag.color }}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: hexToRgba(tag.color, 0.12) }}
                    >
                        <Hash className="h-4 w-4" style={{ color: tag.color }} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground font-mono truncate">
                            {tag.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Updated {tag.updatedAt}
                        </p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={handleEdit}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopy}>
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            Copy name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Description */}
            {tag.description && (
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {tag.description}
                </p>
            )}

            {/* Stats */}
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-border/60">
                <StatChip icon={Users} value={tag.contactCount} label="contacts" />
                <StatChip icon={Zap} value={tag.automationCount} label="flows" />
                <StatChip icon={Send} value={tag.campaignCount} label="campaigns" />
            </div>
        </div>
    );
}

function StatChip({
                      icon: Icon,
                      value,
                      label,
                  }: {
    icon: React.ElementType;
    value: number;
    label: string;
}) {
    return (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Icon className="h-3 w-3" />
            <span className="font-semibold tabular-nums text-foreground">{value.toLocaleString()}</span>
            <span>{label}</span>
        </div>
    );
}

// ── Tag List Row ──────────────────────────────────────────────────────────────

interface TagRowProps {
    tag: ContactTag;
    isFirst: boolean;
    isLast: boolean;
    onEdit: (tag: ContactTag) => void;
    onDelete: (tag: ContactTag) => void;
    onCopy: (name: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
}

function TagRow({
                    tag,
                    isFirst,
                    isLast,
                    onEdit,
                    onDelete,
                    onCopy,
                    onMoveUp,
                    onMoveDown,
                }: TagRowProps) {
    const handleEdit = useCallback(() => onEdit(tag), [onEdit, tag]);
    const handleDelete = useCallback(() => onDelete(tag), [onDelete, tag]);
    const handleCopy = useCallback(() => onCopy(tag.name), [onCopy, tag.name]);
    const handleUp = useCallback(() => onMoveUp(tag.id), [onMoveUp, tag.id]);
    const handleDown = useCallback(() => onMoveDown(tag.id), [onMoveDown, tag.id]);

    return (
        <div className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3.5 transition-colors hover:bg-secondary/20">
            {/* Color dot */}
            <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: tag.color }}
            />

            {/* Tag pill */}
            <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold font-mono shrink-0"
                style={{
                    backgroundColor: hexToRgba(tag.color, 0.1),
                    color: tag.color,
                    border: `1px solid ${hexToRgba(tag.color, 0.25)}`,
                }}
            >
                <Hash className="h-3 w-3" />
                {tag.name}
            </span>

            {/* Description */}
            <p className="flex-1 text-xs text-muted-foreground truncate hidden sm:block">
                {tag.description || '—'}
            </p>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-6 text-right shrink-0">
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {tag.contactCount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">contacts</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {tag.automationCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">flows</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {tag.campaignCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">campaigns</p>
                </div>
            </div>

            {/* Updated */}
            <p className="hidden lg:block text-xs text-muted-foreground shrink-0">{tag.updatedAt}</p>

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleUp}
                    disabled={isFirst}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 transition-colors"
                >
                    <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={handleDown}
                    disabled={isLast}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 transition-colors"
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                    onClick={handleEdit}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={handleCopy}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={handleDelete}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────

function DeleteTagDialog({
                             tag,
                             onClose,
                             onConfirm,
                         }: {
    tag: ContactTag | null;
    onClose: () => void;
    onConfirm: (id: string) => void;
}) {
    const handleConfirm = useCallback(() => {
        if (tag) onConfirm(tag.id);
    }, [tag, onConfirm]);

    return (
        <AlertDialog open={!!tag} onOpenChange={(v) => !v && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete tag?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3">
                            {tag && (
                                <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                                    <div
                                        className="h-8 w-8 flex items-center justify-center rounded-lg shrink-0"
                                        style={{ backgroundColor: hexToRgba(tag.color, 0.12) }}
                                    >
                                        <Hash className="h-4 w-4" style={{ color: tag.color }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground font-mono">
                                            #{tag.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {tag.contactCount.toLocaleString()} contacts tagged
                                        </p>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">
                                This tag will be permanently removed from all{' '}
                                <span className="font-semibold text-foreground">
                                    {tag?.contactCount.toLocaleString()}
                                </span>{' '}
                                contacts and{' '}
                                <span className="font-semibold text-foreground">
                                    {tag?.automationCount}
                                </span>{' '}
                                automation{tag?.automationCount !== 1 ? 's' : ''}. This action cannot be
                                undone.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete tag
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ── Copy Toast ────────────────────────────────────────────────────────────────

function CopyToast({ name, onDone }: { name: string; onDone: () => void }) {
    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 duration-200"
            onAnimationEnd={onDone}
        >
            <Check className="h-4 w-4 text-emerald-400" />
            Copied <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">#{name}</code>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ListsPage() {
    const [tags, setTags] = useState<ContactTag[]>(MOCK_TAGS);
    const [query, setQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    // Modal states
    const [formOpen, setFormOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<ContactTag | null>(null);
    const [deletingTag, setDeletingTag] = useState<ContactTag | null>(null);
    const [copiedName, setCopiedName] = useState<string | null>(null);

    // Computed stats
    const totalContacts = tags.reduce((s, t) => s + t.contactCount, 0);
    const totalAutomations = tags.reduce((s, t) => s + t.automationCount, 0);
    const totalCampaigns = tags.reduce((s, t) => s + t.campaignCount, 0);

    // Filtered & sorted
    const filtered = useMemo(() => {
        let list = tags;
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q),
            );
        }
        return [...list].sort((a, b) => {
            let cmp = 0;
            if (sortField === 'name') cmp = a.name.localeCompare(b.name);
            else if (sortField === 'contactCount') cmp = a.contactCount - b.contactCount;
            else if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [tags, query, sortField, sortDir]);

    const existingNames = useMemo(() => tags.map((t) => t.name), [tags]);

    // Handlers
    const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleSort = useCallback(
        (field: SortField) => {
            if (sortField === field) {
                setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortField(field);
                setSortDir('asc');
            }
        },
        [sortField],
    );

    const openCreate = useCallback(() => {
        setEditingTag(null);
        setFormOpen(true);
    }, []);

    const openEdit = useCallback((tag: ContactTag) => {
        setEditingTag(tag);
        setFormOpen(true);
    }, []);

    const handleSave = useCallback((tag: ContactTag) => {
        setTags((prev) => {
            const idx = prev.findIndex((t) => t.id === tag.id);
            return idx === -1 ? [...prev, tag] : prev.map((t) => (t.id === tag.id ? tag : t));
        });
    }, []);

    const handleDelete = useCallback((id: string) => {
        setTags((prev) => prev.filter((t) => t.id !== id));
        setDeletingTag(null);
    }, []);

    const handleCopy = useCallback((name: string) => {
        navigator.clipboard.writeText(name).catch(() => undefined);
        setCopiedName(name);
        setTimeout(() => setCopiedName(null), 2200);
    }, []);

    const handleMoveUp = useCallback((id: string) => {
        setTags((prev) => {
            const idx = prev.findIndex((t) => t.id === id);
            if (idx <= 0) return prev;
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
    }, []);

    const handleMoveDown = useCallback((id: string) => {
        setTags((prev) => {
            const idx = prev.findIndex((t) => t.id === id);
            if (idx < 0 || idx >= prev.length - 1) return prev;
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });
    }, []);

    const SortButton = ({
                            field,
                            children,
                        }: {
        field: SortField;
        children: React.ReactNode;
    }) => (
        <button
            onClick={() => handleSort(field)}
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
            {children}
            {sortField === field ? (
                sortDir === 'asc' ? (
                    <ChevronUp className="h-3 w-3" />
                ) : (
                    <ChevronDown className="h-3 w-3" />
                )
            ) : null}
        </button>
    );

    return (
        <>
            <PageHeader onCreate={openCreate} />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">
                    {/* ── KPI strip ── */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <KpiCard
                            icon={Tag}
                            label="Total tags"
                            value={tags.length}
                            sub={`${filtered.length} shown`}
                        />
                        <KpiCard
                            icon={Users}
                            label="Tagged contacts"
                            value={totalContacts.toLocaleString()}
                            sub="across all tags"
                        />
                        <KpiCard
                            icon={Zap}
                            label="Automation triggers"
                            value={totalAutomations}
                            sub="using tags"
                        />
                        <KpiCard
                            icon={Send}
                            label="Campaigns using tags"
                            value={totalCampaigns}
                        />
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={query}
                                onChange={handleQueryChange}
                                placeholder="Search tags…"
                                className="pl-8 h-9 text-sm"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Sort:{' '}
                                    {sortField === 'name'
                                        ? 'Name'
                                        : sortField === 'contactCount'
                                            ? 'Contacts'
                                            : 'Date'}
                                    {sortDir === 'asc' ? (
                                        <ChevronUp className="h-3 w-3" />
                                    ) : (
                                        <ChevronDown className="h-3 w-3" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => handleSort('name')}>
                                    {sortField === 'name' && (
                                        <Check className="h-3.5 w-3.5 mr-2 text-primary" />
                                    )}
                                    <span className={sortField !== 'name' ? 'ml-5' : ''}>
                                    Name
                                </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSort('contactCount')}>
                                    {sortField === 'contactCount' && (
                                        <Check className="h-3.5 w-3.5 mr-2 text-primary" />
                                    )}
                                    <span className={sortField !== 'contactCount' ? 'ml-5' : ''}>
                                    Contact count
                                </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                                    {sortField === 'createdAt' && (
                                        <Check className="h-3.5 w-3.5 mr-2 text-primary" />
                                    )}
                                    <span className={sortField !== 'createdAt' ? 'ml-5' : ''}>
                                    Date created
                                </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* View toggle */}
                        <div className="inline-flex rounded-md border border-border bg-background p-0.5 ml-auto">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'rounded px-2.5 py-1.5 transition-colors',
                                    viewMode === 'list'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                                title="List view"
                            >
                                <Filter className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    'rounded px-2.5 py-1.5 transition-colors',
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                                title="Grid view"
                            >
                                <Hash className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <span className="text-xs text-muted-foreground tabular-nums">
                        {filtered.length} tag{filtered.length !== 1 ? 's' : ''}
                    </span>
                    </div>

                    {/* ── Color legend ── */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => setQuery(tag.name)}
                                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold font-mono transition-all hover:opacity-80 hover:scale-105"
                                    style={{
                                        backgroundColor: hexToRgba(tag.color, 0.1),
                                        color: tag.color,
                                        border: `1px solid ${hexToRgba(tag.color, 0.25)}`,
                                        opacity: query && !tag.name.includes(query) ? 0.4 : 1,
                                    }}
                                    title={`Filter by #${tag.name}`}
                                >
                                    <Hash className="h-3 w-3" />
                                    {tag.name}
                                    <span
                                        className="ml-0.5 rounded-full px-1 text-[10px]"
                                        style={{ backgroundColor: hexToRgba(tag.color, 0.2) }}
                                    >
                                    {tag.contactCount.toLocaleString()}
                                </span>
                                </button>
                            ))}
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                    Clear filter
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── Content ── */}
                    {filtered.length === 0 ? (
                        <EmptyState query={query} onCreateNew={openCreate} />
                    ) : viewMode === 'grid' ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((tag) => (
                                <TagCard
                                    key={tag.id}
                                    tag={tag}
                                    onEdit={openEdit}
                                    onDelete={setDeletingTag}
                                    onCopy={handleCopy}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* List header */}
                            <div className="flex items-center gap-4 px-5 pb-1.5">
                                <div className="w-3 shrink-0" />
                                <SortButton field="name">Tag name</SortButton>
                                <div className="flex-1 hidden sm:block" />
                                <div className="hidden md:flex items-center gap-6 text-right">
                                    <SortButton field="contactCount">
                                        <span className="w-16 text-right inline-block">Contacts</span>
                                    </SortButton>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-8 text-right">
                                    Flows
                                </span>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-16 text-right">
                                    Campaigns
                                </span>
                                </div>
                                <SortButton field="createdAt">
                                    <span className="hidden lg:inline">Updated</span>
                                </SortButton>
                                <div className="w-24 shrink-0" />
                            </div>

                            <div className="space-y-2">
                                {filtered.map((tag, i) => (
                                    <TagRow
                                        key={tag.id}
                                        tag={tag}
                                        isFirst={i === 0}
                                        isLast={i === filtered.length - 1}
                                        onEdit={openEdit}
                                        onDelete={setDeletingTag}
                                        onCopy={handleCopy}
                                        onMoveUp={handleMoveUp}
                                        onMoveDown={handleMoveDown}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </Content>
            </div>

            {/* ── Modals ── */}
            <TagFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                tag={editingTag}
                existingNames={existingNames}
                onSave={handleSave}
            />

            <DeleteTagDialog
                tag={deletingTag}
                onClose={() => setDeletingTag(null)}
                onConfirm={handleDelete}
            />

            {/* ── Copy toast ── */}
            {copiedName && (
                <CopyToast name={copiedName} onDone={() => setCopiedName(null)} />
            )}
        </>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({
                        query,
                        onCreateNew,
                    }: {
    query: string;
    onCreateNew: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border">
            <div className="rounded-full bg-secondary p-4 mb-4">
                <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            {query ? (
                <>
                    <p className="text-sm font-semibold text-foreground mb-1">No tags found</p>
                    <p className="text-xs text-muted-foreground mb-4">
                        No tags match <span className="font-mono">"{query}"</span>. Try a different search.
                    </p>
                </>
            ) : (
                <>
                    <p className="text-sm font-semibold text-foreground mb-1">No tags yet</p>
                    <p className="text-xs text-muted-foreground mb-4">
                        Create your first tag to start organizing contacts.
                    </p>
                    <Button size="sm" onClick={onCreateNew}>
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Create tag
                    </Button>
                </>
            )}
        </div>
    );
}
