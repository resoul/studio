import {
    useState,
    useCallback,
    useMemo,
    useRef,
    ChangeEvent,
    DragEvent,
} from 'react';
import {
    Image,
    List,
    LayoutGrid,
    Upload,
    Search,
    Trash2,
    Download,
    Check,
    X,
    FolderPlus,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    MoreHorizontal,
    ExternalLink,
    Eye,
    Link2,
    Star,
    StarOff,
    Clock,
    HardDrive,
    Zap,
    Globe,
    ImageOff,
    AlertCircle,
    Info,
    ArrowUpDown,
    CheckSquare,
    Square,
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Content } from '@/layout/components/content';
import { ContentHeader } from '@/layout/components/content-header';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'gif' | 'svg' | 'video';
export type StockSourceKey = 'unsplash' | 'pexels' | 'pixabay' | 'google_drive' | 'dropbox' | 'mega';
export type ViewMode = 'grid' | 'list';
export type SortField = 'name' | 'size' | 'createdAt' | 'usageCount';
export type SortDir = 'asc' | 'desc';

export interface MediaFolder {
    id: string;
    name: string;
    parentId: string | null;
    itemCount: number;
    createdAt: string;
}

export interface MediaFile {
    id: string;
    folderId: string | null;
    name: string;
    url: string;
    thumbUrl: string;
    type: MediaType;
    size: number;        // bytes
    width: number;
    height: number;
    alt: string;
    tags: string[];
    starred: boolean;
    usageCount: number;  // times inserted in emails
    source: 'upload' | StockSourceKey;
    createdAt: string;
}

export interface StockSource {
    key: StockSourceKey;
    label: string;
    description: string;
    icon: string;         // emoji
    color: string;
    connected: boolean;
    requiresApiKey: boolean;
    apiKey?: string;
    freeLimit?: string;
    website: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const STOCK_SOURCES: StockSource[] = [
    {
        key: 'unsplash',
        label: 'Unsplash',
        description: 'Free high-resolution photos',
        icon: '🏔',
        color: '#000000',
        connected: true,
        requiresApiKey: true,
        apiKey: 'usk_demo_••••••••••••',
        freeLimit: '50 req/hr',
        website: 'https://unsplash.com/developers',
    },
    {
        key: 'pexels',
        label: 'Pexels',
        description: 'Free stock photos & videos',
        icon: '🌿',
        color: '#05A081',
        connected: false,
        requiresApiKey: true,
        freeLimit: 'Unlimited',
        website: 'https://www.pexels.com/api/',
    },
    {
        key: 'pixabay',
        label: 'Pixabay',
        description: 'Free images, vectors & videos',
        icon: '🌻',
        color: '#2EC66E',
        connected: false,
        requiresApiKey: true,
        freeLimit: '100 req/min',
        website: 'https://pixabay.com/api/docs/',
    },
    {
        key: 'google_drive',
        label: 'Google Drive',
        description: 'Access files from your Drive',
        icon: '🔷',
        color: '#4285F4',
        connected: false,
        requiresApiKey: false,
        website: 'https://drive.google.com',
    },
    {
        key: 'dropbox',
        label: 'Dropbox',
        description: 'Browse and import from Dropbox',
        icon: '📦',
        color: '#0061FF',
        connected: false,
        requiresApiKey: false,
        website: 'https://dropbox.com',
    },
    {
        key: 'mega',
        label: 'MEGA',
        description: 'Secure cloud storage',
        icon: '🔴',
        color: '#D9272E',
        connected: false,
        requiresApiKey: false,
        website: 'https://mega.nz',
    },
];

const MOCK_FOLDERS: MediaFolder[] = [
    { id: 'f1', name: 'Email Headers', parentId: null, itemCount: 12, createdAt: '2026-01-10' },
    { id: 'f2', name: 'Product Photos', parentId: null, itemCount: 34, createdAt: '2026-01-15' },
    { id: 'f3', name: 'Brand Assets', parentId: null, itemCount: 8, createdAt: '2026-02-01' },
    { id: 'f4', name: 'Campaign — Spring 2026', parentId: null, itemCount: 22, createdAt: '2026-02-20' },
    { id: 'f5', name: 'Backgrounds', parentId: 'f1', itemCount: 6, createdAt: '2026-03-01' },
];

// Unsplash-like placeholder images
const PHOTO_IDS = [
    '1486312338219-ce68d2c6f44d',
    '1498050108023-c5249f4df085',
    '1551434678-e076c223a692',
    '1497366811353-6870744d04b2',
    '1521737852567-6949f3f9f2b5',
    '1542273917363-3b1817f69a2d',
    '1519389950473-47ba0277781c',
    '1518770660439-4636190af475',
    '1485827404703-89b55fcc595e',
    '1557682250-33bd709cbe85',
    '1444703686981-a3abbc4d4fe3',
    '1501854140801-50d01698950b',
    '1493723843671-1d655e66ac1c',
    '1462275646964-a0e3386b89fa',
    '1504674900247-0877df9cc836',
    '1488646953014-85cb44e25828',
    '1519085360753-af0119f7cbe7',
    '1511895426328-dc8714191011',
];

const FOLDERS_FOR_FILES = [null, null, 'f1', 'f1', 'f2', 'f2', 'f2', 'f3', 'f4', 'f4', null, 'f1', 'f2', 'f3', null, 'f4', null, 'f2'];
const SOURCES: Array<'upload' | StockSourceKey> = ['upload', 'unsplash', 'upload', 'upload', 'unsplash', 'upload', 'upload', 'upload', 'unsplash', 'upload', 'unsplash', 'upload', 'upload', 'upload', 'unsplash', 'upload', 'upload', 'unsplash'];
const WIDTHS =  [1200, 1920, 800, 1600, 1200, 900, 1440, 1200, 1920, 800, 1200, 900, 1600, 1200, 800, 1920, 1200, 900];
const HEIGHTS = [800,  1080, 600, 900,  800,  600, 900,  800,  1080, 533, 800,  600, 900,  800,  533, 1080, 800,  600];
const SIZES =   [245120, 1843200, 102400, 512000, 614400, 307200, 921600, 204800, 1536000, 163840, 409600, 204800, 716800, 358400, 122880, 1228800, 460800, 266240];
const NAMES = [
    'laptop-workspace.jpg', 'code-screen.jpg', 'coffee-desk.jpg', 'office-meeting.jpg',
    'team-work.jpg', 'modern-office.jpg', 'meeting-room.jpg', 'circuit-board.jpg',
    'robot-tech.jpg', 'purple-gradient.jpg', 'galaxy-night.jpg', 'green-forest.jpg',
    'mountain-lake.jpg', 'sunrise-peak.jpg', 'avocado-toast.jpg', 'airplane-window.jpg',
    'portrait-pro.jpg', 'cafe-laptop.jpg',
];
const TAGS_POOL = [['workspace', 'laptop'], ['tech', 'code'], ['coffee', 'morning'], ['office', 'business'], ['team', 'people'], ['office', 'minimal'], ['meeting', 'business'], ['tech', 'circuit'], ['ai', 'robot'], ['abstract', 'purple'], ['space', 'night'], ['nature', 'forest'], ['landscape', 'water'], ['mountain', 'sunrise'], ['food', 'healthy'], ['travel', 'sky'], ['portrait', 'person'], ['lifestyle', 'coffee']];

function makeUrl(id: string, w = 600, h = 400) {
    return `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop`;
}

const MOCK_FILES: MediaFile[] = PHOTO_IDS.map((id, i) => ({
    id: `m${i + 1}`,
    folderId: FOLDERS_FOR_FILES[i],
    name: NAMES[i],
    url: makeUrl(id, WIDTHS[i], HEIGHTS[i]),
    thumbUrl: makeUrl(id, 400, 280),
    type: 'image' as MediaType,
    size: SIZES[i],
    width: WIDTHS[i],
    height: HEIGHTS[i],
    alt: NAMES[i].replace(/-/g, ' ').replace('.jpg', ''),
    tags: TAGS_POOL[i],
    starred: [0, 4, 8, 14].includes(i),
    usageCount: [12, 0, 3, 7, 5, 1, 0, 8, 2, 0, 4, 1, 0, 6, 0, 3, 9, 1][i],
    source: SOURCES[i],
    createdAt: `2026-0${Math.floor(i / 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function uid() {
    return `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function fmtSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function fmtDims(w: number, h: number): string {
    return `${w} × ${h}`;
}

function totalStorageUsed(files: MediaFile[]): number {
    return files.reduce((s, f) => s + f.size, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub }: {
    icon: React.ElementType; label: string; value: string | number; sub?: string;
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

// ─────────────────────────────────────────────────────────────────────────────
// Storage Bar
// ─────────────────────────────────────────────────────────────────────────────

function StorageBar({ used, total }: { used: number; total: number }) {
    const pct = Math.min(100, (used / total) * 100);
    const warn = pct > 80;
    const danger = pct > 95;
    return (
        <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <HardDrive className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Storage used</p>
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                        {fmtSize(used)} / {fmtSize(total)}
                    </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            danger ? 'bg-destructive' : warn ? 'bg-amber-500' : 'bg-primary',
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(1)}% used</p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Folder Sidebar
// ─────────────────────────────────────────────────────────────────────────────

interface FolderSidebarProps {
    folders: MediaFolder[];
    selectedFolderId: string | null | 'all' | 'starred' | 'recent';
    onSelect: (id: string | null | 'all' | 'starred' | 'recent') => void;
    onCreateFolder: () => void;
    onDeleteFolder: (id: string) => void;
}

function FolderSidebar({ folders, selectedFolderId, onSelect, onCreateFolder, onDeleteFolder }: FolderSidebarProps) {
    const roots = folders.filter(f => f.parentId === null);

    const smartViews: Array<{ id: string; label: string; icon: React.ElementType; count?: number }> = [
        { id: 'all', label: 'All files', icon: Image },
        { id: 'starred', label: 'Starred', icon: Star },
        { id: 'recent', label: 'Recently added', icon: Clock },
    ];

    return (
        <>
            <nav className="flex-1 overflow-y-auto py-2">
                {/* Smart views */}
                <div className="px-2 mb-3">
                    {smartViews.map(v => {
                        const Icon = v.icon;
                        const active = selectedFolderId === v.id;
                        return (
                            <button
                                key={v.id}
                                onClick={() => onSelect(v.id as 'all' | 'starred' | 'recent')}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors text-left',
                                    active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                )}
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="flex-1 truncate">{v.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="mx-3 mb-2 border-t border-border" />

                {/* Folders label */}
                <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Folders</p>

                {roots.length === 0 && (
                    <p className="px-4 py-3 text-xs text-muted-foreground">No folders yet</p>
                )}

                <div className="px-2 space-y-0.5">
                    {roots.map(folder => {
                        const children = folders.filter(f => f.parentId === folder.id);
                        const active = selectedFolderId === folder.id;
                        return (
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                children={children}
                                selectedFolderId={selectedFolderId}
                                onSelect={onSelect}
                                onDelete={onDeleteFolder}
                                active={active}
                            />
                        );
                    })}
                </div>
            </nav>

            {/* Create folder CTA */}
            <div className="border-t border-border px-3 py-2.5">
                <button
                    onClick={onCreateFolder}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <FolderPlus className="h-3.5 w-3.5" />
                    New folder
                </button>
            </div>
        </>
    );
}

function FolderItem({
                        folder,
                        children,
                        selectedFolderId,
                        onSelect,
                        onDelete,
                        active,
                    }: {
    folder: MediaFolder;
    children: MediaFolder[];
    selectedFolderId: string | null | 'all' | 'starred' | 'recent';
    onSelect: (id: string | null | 'all' | 'starred' | 'recent') => void;
    onDelete: (id: string) => void;
    active: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = children.length > 0;

    return (
        <div>
            <div className={cn(
                'group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors cursor-pointer',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}>
                {hasChildren ? (
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="shrink-0 p-0.5"
                    >
                        {expanded
                            ? <ChevronDown className="h-3 w-3" />
                            : <ChevronRight className="h-3 w-3" />}
                    </button>
                ) : (
                    <span className="w-4 shrink-0" />
                )}

                <button
                    onClick={() => onSelect(folder.id)}
                    className="flex flex-1 items-center gap-1.5 min-w-0 text-left"
                >
                    {active ? (
                        <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                        <Folder className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate text-sm">{folder.name}</span>
                </button>

                <span className="text-[10px] tabular-nums opacity-60 shrink-0">{folder.itemCount}</span>

                <button
                    onClick={() => onDelete(folder.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:text-destructive shrink-0"
                >
                    <Trash2 className="h-3 w-3" />
                </button>
            </div>

            {expanded && hasChildren && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                    {children.map(child => (
                        <button
                            key={child.id}
                            onClick={() => onSelect(child.id)}
                            className={cn(
                                'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors text-left',
                                selectedFolderId === child.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                            )}
                        >
                            <Folder className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex-1 truncate">{child.name}</span>
                            <span className="text-[10px] tabular-nums opacity-60">{child.itemCount}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Grid Card
// ─────────────────────────────────────────────────────────────────────────────

interface MediaCardProps {
    file: MediaFile;
    selected: boolean;
    onSelect: (id: string) => void;
    onToggleStar: (id: string) => void;
    onDelete: (file: MediaFile) => void;
    onCopyUrl: (url: string, name: string) => void;
    onPreview: (file: MediaFile) => void;
}

function MediaCard({ file, selected, onSelect, onToggleStar, onDelete, onCopyUrl, onPreview }: MediaCardProps) {
    const [imgError, setImgError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={cn(
                'group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                selected ? 'border-primary shadow-md shadow-primary/20' : 'border-transparent hover:border-border',
            )}
            onClick={() => onSelect(file.id)}
        >
            {/* Thumbnail */}
            <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                {!imgError ? (
                    <>
                        {!loaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            </div>
                        )}
                        <img
                            src={file.thumbUrl}
                            alt={file.alt}
                            className={cn('w-full h-full object-cover transition-all duration-300', loaded ? 'opacity-100' : 'opacity-0', 'group-hover:scale-105')}
                            onLoad={() => setLoaded(true)}
                            onError={() => setImgError(true)}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground">Failed to load</span>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPreview(file); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white transition-colors shadow-sm"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onCopyUrl(file.url, file.name); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white transition-colors shadow-sm"
                    >
                        <Link2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Selection checkbox */}
                <div
                    className={cn(
                        'absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded transition-opacity',
                        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                    )}
                >
                    {selected ? (
                        <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                        </div>
                    ) : (
                        <div className="h-5 w-5 rounded border-2 border-white bg-black/30" />
                    )}
                </div>

                {/* Star */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }}
                    className={cn(
                        'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full transition-all',
                        file.starred ? 'opacity-100 bg-amber-400/90' : 'opacity-0 group-hover:opacity-100 bg-black/30',
                    )}
                >
                    <Star className={cn('h-3 w-3', file.starred ? 'text-white fill-white' : 'text-white')} />
                </button>

                {/* Source badge */}
                {file.source !== 'upload' && (
                    <div className="absolute bottom-2 left-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white font-medium">
                            <Globe className="h-2.5 w-2.5" />
                            {file.source}
                        </span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-card px-3 py-2.5 border-t border-border">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {fmtSize(file.size)} · {fmtDims(file.width, file.height)}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => onPreview(file)}>
                                <Eye className="h-3.5 w-3.5 mr-2" />Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCopyUrl(file.url, file.name)}>
                                <Link2 className="h-3.5 w-3.5 mr-2" />Copy URL
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={file.url} download={file.name} onClick={(e) => e.stopPropagation()}>
                                    <Download className="h-3.5 w-3.5 mr-2" />Download
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggleStar(file.id)}>
                                {file.starred ? (
                                    <><StarOff className="h-3.5 w-3.5 mr-2" />Unstar</>
                                ) : (
                                    <><Star className="h-3.5 w-3.5 mr-2" />Star</>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(file)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {file.usageCount > 0 && (
                    <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" />
                        Used in {file.usageCount} email{file.usageCount !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// List Row
// ─────────────────────────────────────────────────────────────────────────────

function MediaRow({ file, selected, onSelect, onToggleStar, onDelete, onCopyUrl, onPreview }: MediaCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className={cn(
                'group flex items-center gap-4 rounded-xl border-2 bg-card px-4 py-3 transition-all cursor-pointer',
                selected ? 'border-primary/50 bg-primary/5' : 'border-transparent hover:border-border hover:bg-secondary/20',
            )}
            onClick={() => onSelect(file.id)}
        >
            {/* Checkbox */}
            <button
                onClick={(e) => { e.stopPropagation(); onSelect(file.id); }}
                className="shrink-0"
            >
                {selected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                ) : (
                    <Square className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>

            {/* Thumb */}
            <div className="h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                {!imgError ? (
                    <img
                        src={file.thumbUrl}
                        alt={file.alt}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <ImageOff className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                )}
            </div>

            {/* Name + tags */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    {file.starred && <Star className="h-3 w-3 shrink-0 text-amber-400 fill-amber-400" />}
                    {file.source !== 'upload' && (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            <Globe className="h-2.5 w-2.5" />
                            {file.source}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {file.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-block rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Dims */}
            <div className="hidden md:block text-right shrink-0 w-28">
                <p className="text-xs text-foreground tabular-nums">{fmtDims(file.width, file.height)}</p>
                <p className="text-[10px] text-muted-foreground">{file.type.toUpperCase()}</p>
            </div>

            {/* Size */}
            <div className="hidden sm:block text-right shrink-0 w-20">
                <p className="text-xs font-medium text-foreground tabular-nums">{fmtSize(file.size)}</p>
            </div>

            {/* Usage */}
            <div className="hidden lg:block text-right shrink-0 w-24">
                {file.usageCount > 0 ? (
                    <p className="text-xs text-primary flex items-center justify-end gap-1">
                        <Zap className="h-3 w-3" />
                        {file.usageCount}x used
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground/50">—</p>
                )}
            </div>

            {/* Date */}
            <div className="hidden xl:block text-right shrink-0 w-24">
                <p className="text-xs text-muted-foreground">{file.createdAt}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onPreview(file); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Eye className="h-3.5 w-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onCopyUrl(file.url, file.name); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Link2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Star className={cn('h-3.5 w-3.5', file.starred && 'text-amber-400 fill-amber-400')} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(file); }} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Preview Modal
// ─────────────────────────────────────────────────────────────────────────────

function PreviewModal({ file, onClose }: { file: MediaFile | null; onClose: () => void }) {
    if (!file) return null;
    return (
        <Dialog open={!!file} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                <div className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                        <div>
                            <p className="text-sm font-semibold text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {fmtDims(file.width, file.height)} · {fmtSize(file.size)} · {file.type.toUpperCase()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a href={file.url} download={file.name}>
                                    <Download className="h-3.5 w-3.5 mr-1.5" />Download
                                </a>
                            </Button>
                            <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="flex-1 overflow-auto bg-secondary/30 flex items-center justify-center p-6">
                        <img
                            src={file.url}
                            alt={file.alt}
                            className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl"
                        />
                    </div>

                    {/* Meta */}
                    <div className="px-5 py-4 border-t border-border shrink-0 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                            <p className="text-sm text-foreground capitalize">{file.source}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Alt text</p>
                            <p className="text-sm text-foreground">{file.alt || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {file.tags.map(t => (
                                    <span key={t} className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* URL */}
                    <div className="px-5 pb-4 shrink-0">
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-3 py-2">
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <p className="flex-1 text-xs font-mono text-muted-foreground truncate">{file.url}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(file.url)}
                                className="shrink-0 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stock Sources Panel
// ─────────────────────────────────────────────────────────────────────────────

interface StockSourcesPanelProps {
    sources: StockSource[];
    onToggle: (key: StockSourceKey) => void;
    onSaveKey: (key: StockSourceKey, apiKey: string) => void;
}

function StockSourcesPanel({ sources, onToggle, onSaveKey }: StockSourcesPanelProps) {
    const [editKey, setEditKey] = useState<StockSourceKey | null>(null);
    const [keyInput, setKeyInput] = useState('');

    const handleSave = useCallback((key: StockSourceKey) => {
        onSaveKey(key, keyInput);
        setEditKey(null);
        setKeyInput('');
    }, [keyInput, onSaveKey]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Stock photo sources</h3>
                <Badge variant="outline" className="text-[10px]">Integrations</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Connect stock photo libraries to browse and import images directly into your email builder. Each source may require an API key.
            </p>

            {sources.map(src => (
                <div
                    key={src.key}
                    className="rounded-xl border border-border bg-card p-4 space-y-3"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl border border-border"
                            style={{ backgroundColor: `${src.color}15` }}
                        >
                            {src.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{src.label}</p>
                                {src.connected && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                                        Connected
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                                <p className="text-xs text-muted-foreground">{src.description}</p>
                                {src.freeLimit && (
                                    <span className="text-[10px] text-muted-foreground/60">· {src.freeLimit} free</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <a
                                href={src.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <Switch
                                checked={src.connected}
                                onCheckedChange={() => onToggle(src.key)}
                            />
                        </div>
                    </div>

                    {/* API key input */}
                    {src.requiresApiKey && src.connected && (
                        <div className="space-y-1.5">
                            {editKey === src.key ? (
                                <div className="flex gap-2">
                                    <Input
                                        value={keyInput}
                                        onChange={(e) => setKeyInput(e.target.value)}
                                        placeholder="Paste your API key…"
                                        className="h-8 text-xs font-mono flex-1"
                                        autoFocus
                                    />
                                    <Button size="sm" className="h-8 text-xs" onClick={() => handleSave(src.key)}>Save</Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setEditKey(null)}>Cancel</Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 rounded-lg bg-secondary/30 border border-border px-3 py-2">
                                    <span className="flex-1 text-xs font-mono text-muted-foreground truncate">
                                        {src.apiKey || 'No key set'}
                                    </span>
                                    <button
                                        onClick={() => { setEditKey(src.key); setKeyInput(''); }}
                                        className="text-xs text-primary hover:underline shrink-0"
                                    >
                                        {src.apiKey ? 'Change' : 'Add key'}
                                    </button>
                                </div>
                            )}
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Info className="h-3 w-3 shrink-0" />
                                Get your free API key at{' '}
                                <a href={src.website} target="_blank" rel="noopener noreferrer" className="underline">
                                    {src.website.replace('https://', '')}
                                </a>
                            </p>
                        </div>
                    )}

                    {src.requiresApiKey && !src.connected && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 bg-secondary/30 rounded-lg px-3 py-2">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            Enable the toggle to connect. An API key will be required.
                        </p>
                    )}

                    {!src.requiresApiKey && !src.connected && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 bg-secondary/30 rounded-lg px-3 py-2">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            Enable the toggle to authorize via OAuth.
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload Drop Zone
// ─────────────────────────────────────────────────────────────────────────────

interface UploadZoneProps {
    folderId: string | null;
    onUpload: (files: MediaFile[]) => void;
}

function UploadZone({ folderId, onUpload }: UploadZoneProps) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFiles = useCallback((rawFiles: File[]) => {
        const imageFiles = rawFiles.filter(f => f.type.startsWith('image/'));
        const now = new Date().toISOString().slice(0, 10);
        const mediaFiles: MediaFile[] = imageFiles.map(f => ({
            id: uid(),
            folderId: folderId,
            name: f.name,
            url: URL.createObjectURL(f),
            thumbUrl: URL.createObjectURL(f),
            type: 'image',
            size: f.size,
            width: 1200,
            height: 800,
            alt: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            tags: [],
            starred: false,
            usageCount: 0,
            source: 'upload',
            createdAt: now,
        }));
        onUpload(mediaFiles);
    }, [folderId, onUpload]);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        processFiles(Array.from(e.dataTransfer.files));
    }, [processFiles]);

    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(Array.from(e.target.files));
        e.target.value = '';
    }, [processFiles]);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-10',
                dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30',
            )}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                    {dragging ? 'Drop files here' : 'Drop images here or click to browse'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF, SVG, WebP · Max 10 MB each
                </p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleInput}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Folder Modal
// ─────────────────────────────────────────────────────────────────────────────

function CreateFolderModal({ open, onOpenChange, onSave }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (name: string) => void;
}) {
    const [name, setName] = useState('');
    const handleSubmit = useCallback(() => {
        if (!name.trim()) return;
        onSave(name.trim());
        onOpenChange(false);
        setName('');
    }, [name, onSave, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderPlus className="h-4 w-4 text-primary" />
                        New folder
                    </DialogTitle>
                    <DialogDescription>Create a folder to organize your media files.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="folder-name">Folder name</Label>
                        <Input
                            id="folder-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Campaign Assets"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={!name.trim()}>Create</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

type RightPanel = 'none' | 'upload' | 'sources';

export default function StorageManagerPage() {
    const [files, setFiles] = useState<MediaFile[]>(MOCK_FILES);
    const [folders, setFolders] = useState<MediaFolder[]>(MOCK_FOLDERS);
    const [sources, setSources] = useState<StockSource[]>(STOCK_SOURCES);

    const [selectedFolderId, setSelectedFolderId] = useState<string | null | 'all' | 'starred' | 'recent'>('all');
    const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [gridCols, setGridCols] = useState<3 | 4 | 5>(4);
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
    const [rightPanel, setRightPanel] = useState<RightPanel>('none');

    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [deletingFile, setDeletingFile] = useState<MediaFile | null>(null);
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    // ── Filtering ──────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        let list = files;

        if (selectedFolderId === 'starred') list = list.filter(f => f.starred);
        else if (selectedFolderId === 'recent') list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);
        else if (selectedFolderId !== 'all' && selectedFolderId !== null) list = list.filter(f => f.folderId === selectedFolderId);

        if (typeFilter !== 'all') list = list.filter(f => f.type === typeFilter);

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(f =>
                f.name.toLowerCase().includes(q) ||
                f.alt.toLowerCase().includes(q) ||
                f.tags.some(t => t.includes(q)),
            );
        }

        return [...list].sort((a, b) => {
            let cmp = 0;
            if (sortField === 'name') cmp = a.name.localeCompare(b.name);
            else if (sortField === 'size') cmp = a.size - b.size;
            else if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
            else if (sortField === 'usageCount') cmp = a.usageCount - b.usageCount;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [files, selectedFolderId, typeFilter, query, sortField, sortDir]);

    // ── Stats ──────────────────────────────────────────────────────────────────

    const totalSize = totalStorageUsed(files);
    const STORAGE_QUOTA = 1024 * 1024 * 1024; // 1 GB mock

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSelectFile = useCallback((id: string) => {
        setSelectedFileIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedFileIds.size === filtered.length) {
            setSelectedFileIds(new Set());
        } else {
            setSelectedFileIds(new Set(filtered.map(f => f.id)));
        }
    }, [selectedFileIds.size, filtered]);

    const handleToggleStar = useCallback((id: string) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
    }, []);

    const handleDelete = useCallback((file: MediaFile) => {
        setDeletingFile(file);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!deletingFile) return;
        setFiles(prev => prev.filter(f => f.id !== deletingFile.id));
        setSelectedFileIds(prev => { const n = new Set(prev); n.delete(deletingFile.id); return n; });
        setDeletingFile(null);
    }, [deletingFile]);

    const handleDeleteSelected = useCallback(() => {
        setFiles(prev => prev.filter(f => !selectedFileIds.has(f.id)));
        setSelectedFileIds(new Set());
    }, [selectedFileIds]);

    const handleCopyUrl = useCallback((url: string, name: string) => {
        navigator.clipboard.writeText(url).catch(() => undefined);
        setCopiedUrl(name);
        setTimeout(() => setCopiedUrl(null), 2000);
    }, []);

    const handleUpload = useCallback((newFiles: MediaFile[]) => {
        setFiles(prev => [...newFiles, ...prev]);
        setRightPanel('none');
    }, []);

    const handleCreateFolder = useCallback((name: string) => {
        const folder: MediaFolder = {
            id: uid(),
            name,
            parentId: null,
            itemCount: 0,
            createdAt: new Date().toISOString().slice(0, 10),
        };
        setFolders(prev => [...prev, folder]);
    }, []);

    const handleDeleteFolder = useCallback((id: string) => {
        setFolders(prev => prev.filter(f => f.id !== id));
        if (selectedFolderId === id) setSelectedFolderId('all');
    }, [selectedFolderId]);

    const handleToggleSource = useCallback((key: StockSourceKey) => {
        setSources(prev => prev.map(s => s.key === key ? { ...s, connected: !s.connected } : s));
    }, []);

    const handleSaveApiKey = useCallback((key: StockSourceKey, apiKey: string) => {
        setSources(prev => prev.map(s => s.key === key ? { ...s, apiKey } : s));
    }, []);

    const handleSortChange = useCallback((field: SortField) => {
        setSortField(prev => {
            if (prev === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return field; }
            setSortDir('asc');
            return field;
        });
    }, []);

    const toggleRightPanel = useCallback((panel: RightPanel) => {
        setRightPanel(prev => prev === panel ? 'none' : panel);
    }, []);

    const connectedSourceCount = sources.filter(s => s.connected).length;

    const GRID_COLS_MAP: Record<3 | 4 | 5, string> = {
        3: 'grid-cols-2 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    };

    const currentFolder = typeof selectedFolderId === 'string' && !['all', 'starred', 'recent'].includes(selectedFolderId)
        ? folders.find(f => f.id === selectedFolderId)
        : null;

    const breadcrumb = currentFolder ? currentFolder.name : {
        all: 'All files',
        starred: 'Starred',
        recent: 'Recently added',
    }[selectedFolderId as string] ?? 'All files';

    return (
        <>
            <ContentHeader className="space-x-2">
                <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h2 className="text-sm font-semibold text-foreground">Library</h2>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" mode="icon" size="sm" onClick={() => setFolderModalOpen(true)}>
                                    <FolderPlus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                Add a new folder
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </aside>
                <div className="flex items-center justify-between bg-card grow">
                    <div className="flex items-center gap-2 min-w-0">
                        <h1 className="text-base font-semibold text-foreground shrink-0">Storage</h1>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">{breadcrumb}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Sources button */}
                        <button
                            onClick={() => toggleRightPanel('sources')}
                            className={cn(
                                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border transition-colors',
                                rightPanel === 'sources'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary',
                            )}
                        >
                            <Globe className="h-3.5 w-3.5" />
                            Stock sources
                            {connectedSourceCount > 0 && (
                                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold">
                                    {connectedSourceCount}
                                </span>
                            )}
                        </button>

                        <Button
                            size="sm"
                            onClick={() => toggleRightPanel('upload')}
                            className={cn(
                                'gap-1.5',
                                rightPanel === 'upload'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-accent hover:bg-accent/90 text-accent-foreground',
                            )}
                        >
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                        </Button>
                    </div>
                </div>
            </ContentHeader>
            <div className="container-fluid">
                <Content className="block py-0">
                    <div className="flex flex-1 overflow-hidden">
                        <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden in-data-[sidebar-collapsed]:w-[calc(16rem+36px)] transition-[width] duration-200 ease-in-out">
                            <FolderSidebar
                                folders={folders}
                                selectedFolderId={selectedFolderId}
                                onSelect={setSelectedFolderId}
                                onCreateFolder={() => setFolderModalOpen(true)}
                                onDeleteFolder={handleDeleteFolder}
                            />
                        </aside>
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 py-4 border-b border-border shrink-0">
                                <KpiCard icon={Image} label="Total files" value={files.length} sub={`${filtered.length} visible`} />
                                <KpiCard icon={Folder} label="Folders" value={folders.length} />
                                <KpiCard icon={Zap} label="Used in emails" value={files.reduce((s, f) => s + f.usageCount, 0)} sub="total insertions" />
                                <StorageBar used={totalSize} total={STORAGE_QUOTA} />
                            </div>

                            {/* ── Toolbar ── */}
                            <div className="flex items-center gap-2 px-6 py-3 border-b border-border shrink-0 flex-wrap">
                                {/* Search */}
                                <div className="relative flex-1 max-w-xs min-w-0">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search files, tags…"
                                        className="pl-8 h-8 text-sm"
                                    />
                                    {query && (
                                        <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Type filter */}
                                <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                                    {(['all', 'image', 'gif', 'svg'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTypeFilter(t)}
                                            className={cn(
                                                'rounded px-2.5 py-1 text-xs font-medium transition-colors capitalize',
                                                typeFilter === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                            <ArrowUpDown className="h-3 w-3" />
                                            Sort
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        {([
                                            { field: 'name' as SortField, label: 'Name' },
                                            { field: 'size' as SortField, label: 'File size' },
                                            { field: 'createdAt' as SortField, label: 'Date added' },
                                            { field: 'usageCount' as SortField, label: 'Usage count' },
                                        ]).map(({ field, label }) => (
                                            <DropdownMenuItem key={field} onClick={() => handleSortChange(field)}>
                                                {sortField === field && <Check className="h-3.5 w-3.5 mr-2 text-primary" />}
                                                <span className={sortField !== field ? 'ml-5' : ''}>{label}</span>
                                                {sortField === field && (
                                                    <span className="ml-auto text-[10px] text-muted-foreground">
                                            {sortDir === 'asc' ? '↑' : '↓'}
                                        </span>
                                                )}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Bulk actions */}
                                {selectedFileIds.size > 0 && (
                                    <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5">
                                        <span className="text-xs font-semibold text-primary">{selectedFileIds.size} selected</span>
                                        <button
                                            onClick={handleDeleteSelected}
                                            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" />Delete
                                        </button>
                                        <button
                                            onClick={() => setSelectedFileIds(new Set())}
                                            className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}

                                <div className="ml-auto flex items-center gap-2">
                                    {/* Select all */}
                                    <button
                                        onClick={handleSelectAll}
                                        className="hidden sm:flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                    >
                                        {selectedFileIds.size === filtered.length && filtered.length > 0
                                            ? <CheckSquare className="h-3.5 w-3.5 text-primary" />
                                            : <Square className="h-3.5 w-3.5" />}
                                        All
                                    </button>

                                    <span className="text-xs text-muted-foreground tabular-nums">
                            {filtered.length} file{filtered.length !== 1 ? 's' : ''}
                        </span>

                                    {/* View mode */}
                                    <div className="flex items-center rounded-md border border-border bg-background p-0.5">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={cn('rounded p-1.5 transition-colors', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                                            title="Grid view"
                                        >
                                            <LayoutGrid className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={cn('rounded p-1.5 transition-colors', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                                            title="List view"
                                        >
                                            <List className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* Grid density (only in grid mode) */}
                                    {viewMode === 'grid' && (
                                        <div className="flex items-center rounded-md border border-border bg-background p-0.5">
                                            {([3, 4, 5] as const).map(cols => (
                                                <button
                                                    key={cols}
                                                    onClick={() => setGridCols(cols)}
                                                    className={cn(
                                                        'rounded px-2 py-1 text-[10px] font-semibold transition-colors',
                                                        gridCols === cols ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                                                    )}
                                                >
                                                    {cols}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Content ── */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Files area */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {filtered.length === 0 ? (
                                        <EmptyFiles query={query} onUpload={() => toggleRightPanel('upload')} />
                                    ) : viewMode === 'grid' ? (
                                        <div className={cn('grid gap-4', GRID_COLS_MAP[gridCols])}>
                                            {filtered.map(file => (
                                                <MediaCard
                                                    key={file.id}
                                                    file={file}
                                                    selected={selectedFileIds.has(file.id)}
                                                    onSelect={handleSelectFile}
                                                    onToggleStar={handleToggleStar}
                                                    onDelete={handleDelete}
                                                    onCopyUrl={handleCopyUrl}
                                                    onPreview={setPreviewFile}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {/* List header */}
                                            <div className="flex items-center gap-4 px-4 pb-1">
                                                <div className="w-4 shrink-0" />
                                                <div className="w-16 shrink-0" />
                                                <span className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</span>
                                                <span className="hidden md:block text-right w-28 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dimensions</span>
                                                <span className="hidden sm:block text-right w-20 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Size</span>
                                                <span className="hidden lg:block text-right w-24 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Usage</span>
                                                <span className="hidden xl:block text-right w-24 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Added</span>
                                                <div className="w-24 shrink-0" />
                                            </div>
                                            {filtered.map(file => (
                                                <MediaRow
                                                    key={file.id}
                                                    file={file}
                                                    selected={selectedFileIds.has(file.id)}
                                                    onSelect={handleSelectFile}
                                                    onToggleStar={handleToggleStar}
                                                    onDelete={handleDelete}
                                                    onCopyUrl={handleCopyUrl}
                                                    onPreview={setPreviewFile}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right panel */}
                                {rightPanel !== 'none' && (
                                    <div className="w-80 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                                            <p className="text-sm font-semibold text-foreground">
                                                {rightPanel === 'upload' ? 'Upload files' : 'Stock sources'}
                                            </p>
                                            <button onClick={() => setRightPanel('none')} className="text-muted-foreground hover:text-foreground transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {rightPanel === 'upload' ? (
                                                <div className="space-y-4">
                                                    <UploadZone
                                                        folderId={typeof selectedFolderId === 'string' && !['all', 'starred', 'recent'].includes(selectedFolderId) ? selectedFolderId : null}
                                                        onUpload={handleUpload}
                                                    />
                                                    <div className="rounded-lg border border-border bg-secondary/10 px-4 py-3 space-y-1.5">
                                                        <p className="text-xs font-semibold text-foreground">Upload tips</p>
                                                        {[
                                                            'Use descriptive file names for easier search.',
                                                            'Images are stored as-is — optimize before upload.',
                                                            'WebP format gives the best compression for email.',
                                                        ].map(tip => (
                                                            <p key={tip} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                                                <Info className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
                                                                {tip}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <StockSourcesPanel
                                                    sources={sources}
                                                    onToggle={handleToggleSource}
                                                    onSaveKey={handleSaveApiKey}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Content>
            </div>
            {/* ── Modals ── */}
            <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />

            <CreateFolderModal
                open={folderModalOpen}
                onOpenChange={setFolderModalOpen}
                onSave={handleCreateFolder}
            />

            {/* Delete confirm */}
            {deletingFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-card rounded-xl border border-border shadow-2xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Delete file?</h3>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 mb-3">
                            <div className="h-10 w-14 rounded-md overflow-hidden bg-secondary shrink-0">
                                <img src={deletingFile.thumbUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{deletingFile.name}</p>
                                <p className="text-xs text-muted-foreground">{fmtSize(deletingFile.size)}</p>
                            </div>
                        </div>
                        {deletingFile.usageCount > 0 && (
                            <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 mb-3">
                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    This image is used in {deletingFile.usageCount} email{deletingFile.usageCount !== 1 ? 's' : ''}. Deleting it will break those emails.
                                </p>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setDeletingFile(null)}>Cancel</Button>
                            <Button variant="destructive" size="sm" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Copy toast */}
            {copiedUrl && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 shadow-lg text-sm font-medium">
                    <Check className="h-4 w-4 text-emerald-400" />
                    URL copied — <span className="font-mono text-xs opacity-70">{copiedUrl}</span>
                </div>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────────────────────

function EmptyFiles({ query, onUpload }: { query: string; onUpload: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-secondary p-5 mb-4">
                <Image className="h-10 w-10 text-muted-foreground" />
            </div>
            {query ? (
                <>
                    <p className="text-sm font-semibold text-foreground mb-1">No files found</p>
                    <p className="text-xs text-muted-foreground">No files match <span className="font-mono">"{query}"</span></p>
                </>
            ) : (
                <>
                    <p className="text-sm font-semibold text-foreground mb-1">No files here yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Upload images to start building your media library.</p>
                    <Button size="sm" onClick={onUpload}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Upload files
                    </Button>
                </>
            )}
        </div>
    );
}