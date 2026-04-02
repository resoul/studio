import { useCallback, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CampaignFormData, StepErrors } from '@/types/campaign';
import { LayoutTemplate, CheckCircle, ExternalLink, Rss, FlaskConical } from 'lucide-react';

const SUBJECT_MAX = 60;

interface StepContentProps {
    data: CampaignFormData;
    errors: StepErrors;
    onChange: (patch: Partial<CampaignFormData>) => void;
    onOpenBuilder?: (data: CampaignFormData) => void;
}

export function StepContent({ data, errors, onChange }: StepContentProps) {
    const navigate = useNavigate();
    const { campaignId } = useParams<{ campaignId?: string }>();

    const handleSubjectChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ subject: e.target.value }),
        [onChange],
    );

    const handleSubjectBChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ subjectB: e.target.value }),
        [onChange],
    );

    const handlePreheaderChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ preheader: e.target.value }),
        [onChange],
    );

    const handleRssFeedUrlChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ rssFeedUrl: e.target.value }),
        [onChange],
    );

    const handleOpenBuilder = useCallback(() => {
        const id = campaignId ?? 'new';
        navigate(`/campaigns/${id}/content`);
    }, [navigate, campaignId]);

    const subjectLen = data.subject.length;
    const subjectOverLimit = subjectLen > SUBJECT_MAX;

    const isRss = data.type === 'rss';
    const isAb  = data.type === 'ab';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Email content</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Set subject line and design your email.
                </p>
            </div>

            {/* RSS feed URL — only for rss type */}
            {isRss && (
                <div className="space-y-1.5">
                    <Label htmlFor="rss-feed-url">
                        <span className="inline-flex items-center gap-1.5">
                            <Rss className="h-3.5 w-3.5 text-orange-500" />
                            RSS feed URL <span className="text-destructive">*</span>
                        </span>
                    </Label>
                    <Input
                        id="rss-feed-url"
                        type="url"
                        value={data.rssFeedUrl}
                        onChange={handleRssFeedUrlChange}
                        placeholder="https://yourblog.com/feed.xml"
                        className={errors.rssFeedUrl ? 'border-destructive' : ''}
                    />
                    {errors.rssFeedUrl && (
                        <p className="text-xs text-destructive">{errors.rssFeedUrl}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Campaigns will be sent automatically when new items appear in the feed.
                    </p>
                </div>
            )}

            {/* Subject line */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="subject">
                        {isAb ? (
                            <span className="inline-flex items-center gap-1.5">
                                <FlaskConical className="h-3.5 w-3.5 text-violet-500" />
                                Subject line — Variant A <span className="text-destructive">*</span>
                            </span>
                        ) : (
                            <>Subject line <span className="text-destructive">*</span></>
                        )}
                    </Label>
                    <span
                        className={[
                            'text-xs tabular-nums',
                            subjectOverLimit ? 'text-destructive' : 'text-muted-foreground',
                        ].join(' ')}
                    >
                        {subjectLen}/{SUBJECT_MAX}
                    </span>
                </div>
                <Input
                    id="subject"
                    value={data.subject}
                    onChange={handleSubjectChange}
                    placeholder={isAb ? 'Variant A subject…' : 'Your email subject…'}
                    className={errors.subject || subjectOverLimit ? 'border-destructive' : ''}
                />
                {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                )}
                {subjectOverLimit && !errors.subject && (
                    <p className="text-xs text-destructive">
                        Subject line is too long. Keep it under {SUBJECT_MAX} characters.
                    </p>
                )}
            </div>

            {/* Subject B — only for A/B type */}
            {isAb && (
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="subject-b">
                            <span className="inline-flex items-center gap-1.5">
                                <FlaskConical className="h-3.5 w-3.5 text-violet-500" />
                                Subject line — Variant B <span className="text-destructive">*</span>
                            </span>
                        </Label>
                        <span className="text-xs tabular-nums text-muted-foreground">
                            {data.subjectB.length}/{SUBJECT_MAX}
                        </span>
                    </div>
                    <Input
                        id="subject-b"
                        value={data.subjectB}
                        onChange={handleSubjectBChange}
                        placeholder="Variant B subject…"
                        className={errors.subjectB ? 'border-destructive' : ''}
                    />
                    {errors.subjectB && (
                        <p className="text-xs text-destructive">{errors.subjectB}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Each variant is sent to 50% of the audience. The winner is determined by open rate.
                    </p>
                </div>
            )}

            {/* Preheader */}
            <div className="space-y-1.5">
                <Label htmlFor="preheader">
                    Preheader{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="preheader"
                    value={data.preheader}
                    onChange={handlePreheaderChange}
                    placeholder="Preview text shown after subject in inbox…"
                />
                <p className="text-xs text-muted-foreground">
                    Recommended ~90 characters for best inbox preview coverage.
                </p>
            </div>

            {/* Email builder */}
            <div className="space-y-1.5">
                <Label>Email template</Label>
                <button
                    type="button"
                    onClick={handleOpenBuilder}
                    className={[
                        'group flex w-full items-center gap-4 rounded-lg border-2 border-dashed px-5 py-5 text-left transition-colors',
                        data.templateId
                            ? 'border-accent/50 bg-accent/5 hover:bg-accent/10'
                            : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/30',
                    ].join(' ')}
                >
                    <div
                        className={[
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                            data.templateId
                                ? 'bg-accent/15'
                                : 'bg-secondary group-hover:bg-primary/10',
                        ].join(' ')}
                    >
                        {data.templateId ? (
                            <CheckCircle className="h-5 w-5 text-accent" />
                        ) : (
                            <LayoutTemplate className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p
                            className={[
                                'text-sm font-medium',
                                data.templateId ? 'text-accent' : 'text-foreground',
                            ].join(' ')}
                        >
                            {data.templateId ? 'Template ready — click to edit' : 'Open Email Builder'}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {data.templateId
                                ? 'Your template will be used for this campaign'
                                : 'Design your email with drag-and-drop blocks'}
                        </p>
                    </div>

                    <ExternalLink
                        className={[
                            'h-4 w-4 shrink-0 transition-colors',
                            data.templateId
                                ? 'text-accent/60'
                                : 'text-muted-foreground group-hover:text-primary',
                        ].join(' ')}
                    />
                </button>

                {errors.templateId && (
                    <p className="text-xs text-destructive">{errors.templateId}</p>
                )}
            </div>
        </div>
    );
}