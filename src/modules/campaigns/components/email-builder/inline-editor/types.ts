import type { PersonalizationVariable } from '@/config/personalization';

export interface InlineEditorProps {
    value: string;
    onChange: (html: string) => void;
    style?: React.CSSProperties;
    className?: string;
    tag?: 'div' | 'p' | 'span';
    extraVariables?: PersonalizationVariable[];
}

export interface ToolbarState {
    show: boolean;
    x: number;
    y: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    link: boolean;
    orderedList: boolean;
    unorderedList: boolean;
    alignLeft: boolean;
    alignCenter: boolean;
    alignRight: boolean;
    alignJustify: boolean;
}

export interface ContextMenuState {
    show: boolean;
    x: number;
    y: number;
}

export const TOOLBAR_COLORS = [
    '#000000', '#475569', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
] as const;