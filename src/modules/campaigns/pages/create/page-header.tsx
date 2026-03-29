import { Mails } from 'lucide-react';
import { ContentHeader } from '@/layout/components/content-header';

export function PageHeader() {
  return (
    <ContentHeader className="space-x-2">
      <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
        <Mails className="size-4 text-primary" /> Create campaign
          <p className="text-sm text-muted-foreground mt-0.5">
              New email campaign
          </p>
      </h1>
    </ContentHeader>
  );
}
