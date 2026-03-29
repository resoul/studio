import { Square, Columns2, Columns3 } from 'lucide-react';
import { EmailRow, ColumnLayout } from '@/types/email-builder';

interface ColumnLayoutSelectorProps {
    row: EmailRow;
    onChange: (c: ColumnLayout) => void;
}

const LAYOUTS: { c: ColumnLayout; icon: React.ElementType }[] = [
    { c: 1, icon: Square },
    { c: 2, icon: Columns2 },
    { c: 3, icon: Columns3 },
];

export function ColumnLayoutSelector({ row, onChange }: ColumnLayoutSelectorProps) {
    return (
        <div className="flex gap-0.5">
            {LAYOUTS.map(({ c, icon: Icon }) => (
                <button
                    key={c}
                    onClick={(e) => { e.stopPropagation(); onChange(c); }}
                    className={`rounded p-1 transition-colors ${
                        row.columns === c
                            ? 'bg-primary text-primary-foreground'
                            : 'text-icon hover:bg-secondary'
                    }`}
                >
                    <Icon className="h-3.5 w-3.5" />
                </button>
            ))}
        </div>
    );
}