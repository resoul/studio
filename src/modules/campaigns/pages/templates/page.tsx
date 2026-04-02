import { useCallback, type MouseEvent } from 'react';
import { ArrowRight, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStarterTemplates } from '@/data/email-templates';
import { Content } from '@/layout/components/content';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { PageHeader } from './page-header';

export default function CampaignTemplatesPage() {
    const navigate = useNavigate();
    const { t, language } = useTranslation();
    const templates = getStarterTemplates(language);

    const handleTemplateSelect = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const templateId = event.currentTarget.dataset.templateId;
        if (!templateId) return;
        navigate(`/campaigns/templates/${templateId}`);
    }, [navigate]);

    return (
        <>
            <PageHeader />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <div className="flex items-center gap-2 text-foreground">
                            <LayoutTemplate className="h-4 w-4 text-primary" />
                            <h2 className="text-sm font-semibold">{t('campaigns.templates.listTitle')}</h2>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{t('campaigns.templates.listDescription')}</p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {templates.map((template) => (
                                <article
                                    key={template.id}
                                    className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-primary/[0.03]"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
                                            {template.thumbnail}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                                                {template.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                {template.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="mt-4 w-full justify-between"
                                        variant="outline"
                                        size="sm"
                                        data-template-id={template.id}
                                        onClick={handleTemplateSelect}
                                    >
                                        {t('campaigns.templates.useTemplate')}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </article>
                            ))}
                        </div>
                    </div>
                </Content>
            </div>
        </>
    );
}
