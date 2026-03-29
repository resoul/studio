import { Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';

interface PageHeaderProps {
    onCreate: () => void;
}

export function PageHeader({ onCreate }: PageHeaderProps) {

  return (
    <ContentHeader className="space-x-2">
      <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
        <Tag className="size-4 text-primary" /> Tags
          <p className="text-sm text-muted-foreground mt-0.5">
              Organize contacts with tags. Use them in segments, automations, and filters.
          </p>
      </h1>

      <div className="flex items-center gap-2.5">
          <Button size="sm" onClick={onCreate}>
              <Plus /> New tag
          </Button>
      </div>
    </ContentHeader>
  );
}
