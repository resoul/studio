export type MediaType = 'image' | 'gif' | 'svg' | 'video';
export type StockSourceKey = 'unsplash' | 'pexels' | 'pixabay' | 'google_drive' | 'dropbox' | 'mega';
export type ViewMode = 'grid' | 'list';
export type SortField = 'name' | 'size' | 'createdAt' | 'usageCount';
export type SortDir = 'asc' | 'desc';
export type FolderFilter = string | null | 'all' | 'starred' | 'recent';
export type RightPanel = 'none' | 'upload' | 'sources';

export interface MediaFolder {
    id: string;
    name: string;
    parentId: string | null;
    itemCount: number;
    createdAt: string;
}

export interface EmailUsageItem {
    id: string;
    campaignName: string;
    subject: string;
    status: 'draft' | 'scheduled' | 'sent';
    sentAt?: string;
    openRate?: number;
}

export interface MediaFile {
    id: string;
    folderId: string | null;
    name: string;
    url: string;
    thumbUrl: string;
    type: MediaType;
    size: number;
    width: number;
    height: number;
    alt: string;
    tags: string[];
    starred: boolean;
    usageCount: number;
    usageItems?: EmailUsageItem[];
    source: 'upload' | StockSourceKey;
    createdAt: string;
}

export interface StockSource {
    key: StockSourceKey;
    label: string;
    description: string;
    icon: string;
    color: string;
    connected: boolean;
    requiresApiKey: boolean;
    apiKey?: string;
    freeLimit?: string;
    website: string;
}