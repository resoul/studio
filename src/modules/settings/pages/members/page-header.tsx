import { Plus, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';

interface PageHeaderProps {
    onCreate: () => void;
}

export function PageHeader({ onCreate }: PageHeaderProps) {
    const { t } = useTranslation();

    return (
        <ContentHeader>
            <div className="flex items-center gap-2.5">
                <Zap className="size-4 text-primary shrink-0" />
                <div>
                    <h1 className="text-sm font-semibold leading-none">
                        {t('layout.members.title')}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t('layout.members.subtitle')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                <Button size="sm" onClick={onCreate}>
                    <Plus className="size-3.5" />
                    New graph
                </Button>
            </div>
        </ContentHeader>
    );
}