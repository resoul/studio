import { FormInput, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function PageHeader() {
    const navigate = useNavigate();
    const handleNew         = useCallback(() => navigate('/forms/form/new'), [navigate]);

  return (
    <ContentHeader className="space-x-2">
      <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
        <FormInput className="size-4 text-primary" /> Embed Forms
          <p className="text-sm text-muted-foreground mt-0.5">
              Build embeddable sign-up and contact forms for your website.
          </p>
      </h1>

      <div className="flex items-center gap-2.5">
          <Button size="sm" onClick={handleNew}>
              <Plus /> New form
          </Button>
      </div>
    </ContentHeader>
  );
}
