import { Plus, Mails } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';
import type { CampaignType } from '@/types/campaign';

interface PageHeaderProps {
    onCreate: (type?: CampaignType) => void;
}

export function PageHeader({ onCreate }: PageHeaderProps) {
    return (
        <ContentHeader>
            <div className="flex items-center gap-2.5">
                <Mails className="size-4 text-primary shrink-0" />
                <div>
                    <h1 className="text-sm font-semibold leading-none">Campaigns</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage and send email campaigns to your contacts.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                <Button size="sm" onClick={() => onCreate()}>
                    <Plus className="size-3.5" />
                    New campaign
                </Button>
            </div>
        </ContentHeader>
    );
}