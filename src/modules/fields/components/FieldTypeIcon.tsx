import {
    Type, AlignLeft, Hash, Mail, Phone, Link2,
    Calendar, Clock, ToggleLeft, ChevronDown, ListChecks,
    Palette, Star, Upload, Braces, GitFork, FunctionSquare,
} from 'lucide-react';
import { FieldType } from '@/types/fields';

interface FieldTypeIconProps {
    type: FieldType;
    size?: 'sm' | 'md';
}

const ICON_MAP: Record<FieldType, { Icon: React.ElementType; bg: string; text: string; abbr: string }> = {
    text:        { Icon: Type,            bg: 'bg-blue-100 dark:bg-blue-900/30',      text: 'text-blue-600 dark:text-blue-400',      abbr: 'Abc'  },
    textarea:    { Icon: AlignLeft,       bg: 'bg-sky-100 dark:bg-sky-900/30',        text: 'text-sky-600 dark:text-sky-400',        abbr: '¶'    },
    number:      { Icon: Hash,            bg: 'bg-violet-100 dark:bg-violet-900/30',  text: 'text-violet-600 dark:text-violet-400',  abbr: '123'  },
    email:       { Icon: Mail,            bg: 'bg-indigo-100 dark:bg-indigo-900/30',  text: 'text-indigo-600 dark:text-indigo-400',  abbr: '@'    },
    phone:       { Icon: Phone,           bg: 'bg-emerald-100 dark:bg-emerald-900/30',text: 'text-emerald-600 dark:text-emerald-400',abbr: '☎'   },
    url:         { Icon: Link2,           bg: 'bg-cyan-100 dark:bg-cyan-900/30',      text: 'text-cyan-600 dark:text-cyan-400',      abbr: 'URL'  },
    date:        { Icon: Calendar,        bg: 'bg-orange-100 dark:bg-orange-900/30',  text: 'text-orange-600 dark:text-orange-400',  abbr: '📅'   },
    datetime:    { Icon: Clock,           bg: 'bg-amber-100 dark:bg-amber-900/30',    text: 'text-amber-600 dark:text-amber-400',    abbr: '⏰'   },
    boolean:     { Icon: ToggleLeft,      bg: 'bg-green-100 dark:bg-green-900/30',    text: 'text-green-600 dark:text-green-400',    abbr: 'T/F'  },
    select:      { Icon: ChevronDown,     bg: 'bg-rose-100 dark:bg-rose-900/30',      text: 'text-rose-600 dark:text-rose-400',      abbr: '▾'   },
    multiselect: { Icon: ListChecks,      bg: 'bg-pink-100 dark:bg-pink-900/30',      text: 'text-pink-600 dark:text-pink-400',      abbr: '☑'   },
    color:       { Icon: Palette,         bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',text: 'text-fuchsia-600 dark:text-fuchsia-400',abbr: '🎨'  },
    rating:      { Icon: Star,            bg: 'bg-yellow-100 dark:bg-yellow-900/30',  text: 'text-yellow-600 dark:text-yellow-400',  abbr: '★'   },
    file:        { Icon: Upload,          bg: 'bg-slate-100 dark:bg-slate-900/30',    text: 'text-slate-600 dark:text-slate-400',    abbr: '📎'   },
    json:        { Icon: Braces,          bg: 'bg-teal-100 dark:bg-teal-900/30',      text: 'text-teal-600 dark:text-teal-400',      abbr: '{}'   },
    relation:    { Icon: GitFork,         bg: 'bg-lime-100 dark:bg-lime-900/30',      text: 'text-lime-600 dark:text-lime-400',      abbr: '↔'   },
    formula:     { Icon: FunctionSquare,  bg: 'bg-purple-100 dark:bg-purple-900/30',  text: 'text-purple-600 dark:text-purple-400',  abbr: 'ƒ'   },
};

export function FieldTypeIcon({ type, size = 'md' }: FieldTypeIconProps) {
    const cfg = ICON_MAP[type] ?? ICON_MAP.text;
    const { Icon, bg, text } = cfg;
    const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
    const boxSize  = size === 'sm' ? 'h-6 w-6'     : 'h-8 w-8';

    return (
        <div className={`${boxSize} rounded-md ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`${iconSize} ${text}`} />
        </div>
    );
}

export function FieldTypeBadge({ type }: { type: FieldType }) {
    const cfg = ICON_MAP[type] ?? ICON_MAP.text;
    const { abbr, bg, text } = cfg;
    return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${bg} ${text}`}>
            {abbr}
        </span>
    );
}