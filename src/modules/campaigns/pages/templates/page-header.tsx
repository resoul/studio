import { useCallback } from 'react';
import { LayoutTemplate, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContentHeader } from '@/layout/components/content-header';
import { useTranslation } from '@/hooks/useTranslation';

export function PageHeader() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleStartScratch = useCallback(() => navigate('/campaigns/new/content'), [navigate]);

    return (
        <ContentHeader>
            <div className="flex items-center gap-2.5">
                <LayoutTemplate className="size-4 text-primary shrink-0" />
                <div>
                    <h1 className="text-sm font-semibold leading-none">{t('campaigns.templates.title')}</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t('campaigns.templates.subtitle')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                <Button size="sm" variant="outline" onClick={handleStartScratch}>
                    <Plus className="size-3.5" />
                    {t('campaigns.templates.startScratch')}
                </Button>
            </div>
        </ContentHeader>
    );
}
