import { Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';

interface PageHeaderProps {
    onCreate: () => void;
}

export function PageHeader({ onCreate }: PageHeaderProps) {

  return (
    <ContentHeader className="space-x-2">
      <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
        <Zap className="size-4 text-primary" /> Workflow Graphs
          <p className="text-sm text-muted-foreground mt-0.5">
              Open any graph to inspect and edit it in the workflow canvas.
          </p>
      </h1>

      <div className="flex items-center gap-2.5">
          <Button size="sm" onClick={onCreate}>
              <Plus /> New graph
          </Button>
      </div>
    </ContentHeader>
  );
}
