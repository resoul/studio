import { type LucideIcon } from 'lucide-react';

export interface NavItem {
    id: string;
    title?: string;
    icon?: LucideIcon;
    path?: string;
    badge?: string;
    pinnable?: boolean;
    pinned?: boolean;
    soon?: boolean;
    new?: {
        tooltip: string;
        path: string;
    };
    more?: true;
    dropdown?: true;
}

export type NavConfig = NavItem[];
