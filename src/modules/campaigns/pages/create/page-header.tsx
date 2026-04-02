import { Mails } from 'lucide-react';
import { ContentHeader } from '@/layout/components/content-header';

interface PageHeaderProps {
    isEdit?: boolean;
    campaignId?: string;
}

export function PageHeader({ isEdit, campaignId }: PageHeaderProps) {
    return (
        <ContentHeader className="space-x-2">
            <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
                <Mails className="size-4 text-primary" />
                {isEdit ? 'Edit campaign' : 'Create campaign'}
                {isEdit && campaignId && (
                    <span className="ml-1 font-mono text-xs text-muted-foreground font-normal">
                        #{campaignId}
                    </span>
                )}
            </h1>
        </ContentHeader>
    );
}