import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getStarterTemplates, StarterTemplate } from '@/data/email-templates';
import { EmailTemplate } from '@/types/email-builder';
import { useTranslation } from '@/hooks/useTranslation';

interface TemplatePickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectTemplate: (template: EmailTemplate) => void;
}

export function TemplatePickerModal({ open, onOpenChange, onSelectTemplate }: TemplatePickerModalProps) {
    const { language } = useTranslation();
    const templates = getStarterTemplates(language);

    const handleSelect = (tpl: StarterTemplate) => {
        onSelectTemplate(tpl.build());
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Start from a template</DialogTitle>
                    <DialogDescription>Choose a pre-built template to get started quickly.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 mt-2">
                    {templates.map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => handleSelect(tpl)}
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
                <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                        Start from scratch
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
