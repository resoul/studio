import { Columns2, Columns3, Square, Plus } from 'lucide-react';
import { ColumnLayout } from '@/types/email-builder';

interface RowControlsProps {
  onAddRow: (columns: ColumnLayout) => void;
}

const layouts: { columns: ColumnLayout; icon: React.ElementType; label: string }[] = [
  { columns: 1, icon: Square, label: '1 Column' },
  { columns: 2, icon: Columns2, label: '2 Columns' },
  { columns: 3, icon: Columns3, label: '3 Columns' },
];

export function RowControls({ onAddRow }: RowControlsProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-3">
        Structure
      </h3>
      <div className="space-y-1.5">
        {layouts.map(({ columns, icon: Icon, label }) => (
          <button
            key={columns}
            onClick={() => onAddRow(columns)}
            className="flex w-full items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2.5 text-sm text-icon transition-colors hover:border-primary hover:text-primary"
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
            <Plus className="ml-auto h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
