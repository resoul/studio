import { Plus, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';

interface PageHeaderProps {
    onCreate: () => void;
}

export function PageHeader({ onCreate }: PageHeaderProps) {

  return (
    <ContentHeader className="space-x-2">
      <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
        <Database className="size-4 text-primary" /> Field Manager
          <p className="text-sm text-muted-foreground mt-0.5">
              Define the data fields available on contacts, campaigns and across your workspace.
              The <code className="text-xs font-mono bg-secondary px-1 py-0.5 rounded">email</code> field is required for all contacts.
          </p>
      </h1>

      <div className="flex items-center gap-2.5">
          <Button size="sm" onClick={onCreate}>
              <Plus /> New field
          </Button>
      </div>
    </ContentHeader>
  );
}
