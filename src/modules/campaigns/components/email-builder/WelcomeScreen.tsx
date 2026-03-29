import { FileUp, Sparkles, LayoutTemplate, Plus } from 'lucide-react';
import { getStarterTemplates } from '@/data/email-templates';
import { EmailTemplate } from '@/types/email-builder';
import { useTranslation } from '@/hooks/useTranslation';

interface WelcomeScreenProps {
    onStartScratch: () => void;
    onUploadHtml: () => void;
    onGenerateAI: () => void;
    onSelectTemplate: (template: EmailTemplate) => void;
}

export function WelcomeScreen({ onStartScratch, onUploadHtml, onGenerateAI, onSelectTemplate }: WelcomeScreenProps) {
    const { t, language } = useTranslation();
    const templates = getStarterTemplates(language);

    return (
        <div className="flex-1 overflow-auto bg-canvas">
            <div className="mx-auto max-w-2xl px-6 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-foreground">{t('welcome.title')}</h2>
                    <p className="text-sm text-muted-foreground mt-2">{t('welcome.subtitle')}</p>
                </div>

                {/* Primary actions */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <button
                        onClick={onStartScratch}
                        className="group flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all hover:border-primary/50 hover:bg-primary/[0.03]"
                    >
                        <div className="rounded-full bg-secondary p-3 group-hover:bg-primary/10 transition-colors">
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-foreground">{t('welcome.scratch.title')}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t('welcome.scratch.desc')}</p>
                        </div>
                    </button>

                    <button
                        onClick={onUploadHtml}
                        className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border p-6 transition-all hover:border-primary/50 hover:bg-primary/[0.03]"
                    >
                        <div className="rounded-full bg-secondary p-3 group-hover:bg-primary/10 transition-colors">
                            <FileUp className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-foreground">{t('welcome.upload.title')}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t('welcome.upload.desc')}</p>
                        </div>
                    </button>

                    <button
                        onClick={onGenerateAI}
                        className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border p-6 transition-all hover:border-primary/50 hover:bg-primary/[0.03]"
                    >
                        <div className="rounded-full bg-accent/10 p-3 group-hover:bg-accent/20 transition-colors">
                            <Sparkles className="h-6 w-6 text-accent group-hover:text-accent transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-foreground">{t('welcome.ai.title')}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t('welcome.ai.desc')}</p>
                        </div>
                    </button>
                </div>

                {/* Starter templates */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">{t('welcome.templates.title')}</h3>
                    </div>
                    <div className="grid gap-3">
                        {templates.map(tpl => (
                            <button
                                key={tpl.id}
                                onClick={() => onSelectTemplate(tpl.build())}
                                className="flex items-center gap-4 rounded-lg border border-border p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/[0.03] group"
                            >
                                <span className="text-3xl shrink-0">{tpl.thumbnail}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{tpl.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{tpl.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
