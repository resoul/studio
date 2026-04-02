import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CampaignFormData, WizardStep, STEP_LABELS } from '@/types/campaign';
import { MOCK_LISTS, estimatedTotal } from './StepAudience';
import { CheckCircle, AlertCircle, Pencil, SendHorizonal } from 'lucide-react';

interface ReviewRowProps {
    label: string;
    step: WizardStep;
    onEdit: (step: WizardStep) => void;
    children: React.ReactNode;
}

function ReviewRow({ label, step, onEdit, children }: ReviewRowProps) {
    const handleEdit = useCallback(() => onEdit(step), [onEdit, step]);
    return (
        <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
            <span className="w-28 shrink-0 text-xs text-muted-foreground pt-0.5">{label}</span>
            <div className="flex-1 text-sm text-foreground">{children}</div>
            <button
                type="button"
                onClick={handleEdit}
                className="flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
            >
                <Pencil className="h-3 w-3" />
                {STEP_LABELS[step]}
            </button>
        </div>
    );
}

interface StepReviewProps {
    data: CampaignFormData;
    onGoToStep: (step: WizardStep) => void;
    onSendTest: () => void;
}

const TYPE_LABELS: Record<string, string> = {
    regular:   'Regular',
    ab:        'A/B test',
    automated: 'Automated',
    rss:       'RSS',
};

export function StepReview({ data, onGoToStep, onSendTest }: StepReviewProps) {
    const total = estimatedTotal(data.listIds);
    const listNames = data.listIds.map(
        (id) => MOCK_LISTS.find((l) => l.id === id)?.name ?? id,
    );

    const scheduleLabel =
        data.scheduleType === 'now'
            ? 'Send immediately'
            : `${data.sendDate} at ${data.sendTime} (${data.timezone})`;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Review & send</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Check everything before sending.
                </p>
            </div>

            <div className="rounded-lg border border-border bg-card px-4">
                <ReviewRow label="Campaign name" step="metadata" onEdit={onGoToStep}>
                    {data.name || <span className="text-muted-foreground">—</span>}
                </ReviewRow>

                <ReviewRow label="Type" step="metadata" onEdit={onGoToStep}>
                    {TYPE_LABELS[data.type] ?? data.type}
                </ReviewRow>

                <ReviewRow label="From" step="sender" onEdit={onGoToStep}>
                    {data.fromName || data.fromEmail ? (
                        <>
                            {data.fromName}{' '}
                            <span className="text-muted-foreground">&lt;{data.fromEmail}&gt;</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">—</span>
                    )}
                </ReviewRow>

                <ReviewRow label="Audience" step="audience" onEdit={onGoToStep}>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                        {listNames.length > 0 ? (
                            listNames.map((name) => (
                                <span
                                    key={name}
                                    className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground"
                                >
                                    {name}
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground">No lists selected</span>
                        )}
                    </div>
                    {total > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {total.toLocaleString()} recipients after deduplication
                        </span>
                    )}
                </ReviewRow>

                {/* RSS feed URL */}
                {data.type === 'rss' && (
                    <ReviewRow label="RSS feed" step="content" onEdit={onGoToStep}>
                        {data.rssFeedUrl || <span className="text-muted-foreground">—</span>}
                    </ReviewRow>
                )}

                <ReviewRow label={data.type === 'ab' ? 'Subject A' : 'Subject'} step="content" onEdit={onGoToStep}>
                    {data.subject || <span className="text-muted-foreground">—</span>}
                    {data.preheader && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{data.preheader}</p>
                    )}
                </ReviewRow>

                {/* A/B variant B */}
                {data.type === 'ab' && (
                    <ReviewRow label="Subject B" step="content" onEdit={onGoToStep}>
                        {data.subjectB || <span className="text-muted-foreground">—</span>}
                    </ReviewRow>
                )}

                <ReviewRow label="Template" step="content" onEdit={onGoToStep}>
                    {data.templateId ? (
                        <span className="inline-flex items-center gap-1.5 text-accent">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Ready
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Not set
                        </span>
                    )}
                </ReviewRow>

                <ReviewRow label="Schedule" step="schedule" onEdit={onGoToStep}>
                    {scheduleLabel}
                </ReviewRow>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
                <div>
                    <p className="text-sm font-medium text-foreground">Send test email</p>
                    <p className="text-xs text-muted-foreground">Preview in your inbox first</p>
                </div>
                <Button variant="outline" size="sm" onClick={onSendTest}>
                    <SendHorizonal className="mr-1.5 h-3.5 w-3.5" />
                    Send test
                </Button>
            </div>
        </div>
    );
}