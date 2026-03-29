import { useCallback, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CampaignFormData, SenderOption, StepErrors } from '@/types/campaign';
import { CheckCircle, AlertCircle } from 'lucide-react';

const MOCK_SENDERS: SenderOption[] = [
    { id: 's1', name: 'Marketing Team', email: 'marketing@company.com', verified: true },
    { id: 's2', name: 'Support', email: 'support@company.com', verified: true },
    { id: 's3', name: 'Newsletter', email: 'newsletter@company.com', verified: false },
];

interface StepSenderProps {
    data: CampaignFormData;
    errors: StepErrors;
    onChange: (patch: Partial<CampaignFormData>) => void;
}

export function StepSender({ data, errors, onChange }: StepSenderProps) {
    const handleFromNameChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ fromName: e.target.value }),
        [onChange],
    );

    const handleFromEmailChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ fromEmail: e.target.value }),
        [onChange],
    );

    const handleReplyToChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ replyTo: e.target.value }),
        [onChange],
    );

    const handleSenderSelect = useCallback(
        (sender: SenderOption) => {
            onChange({ fromName: sender.name, fromEmail: sender.email });
        },
        [onChange],
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Sender details</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Choose a verified sender or enter custom details.
                </p>
            </div>

            <div className="space-y-1.5">
                <Label>Saved senders</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {MOCK_SENDERS.map((sender) => {
                        const isSelected = data.fromEmail === sender.email;
                        return (
                            <button
                                key={sender.id}
                                type="button"
                                onClick={() => handleSenderSelect(sender)}
                                className={[
                                    'flex flex-col items-start rounded-lg border p-3 text-left transition-colors',
                                    isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50',
                                ].join(' ')}
                            >
                                <div className="mb-1.5 flex w-full items-center justify-between gap-2">
                                    <span
                                        className={[
                                            'text-sm font-medium',
                                            isSelected ? 'text-primary' : 'text-foreground',
                                        ].join(' ')}
                                    >
                                        {sender.name}
                                    </span>
                                    {sender.verified ? (
                                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-accent" />
                                    ) : (
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                    )}
                                </div>
                                <span className="truncate text-xs text-muted-foreground">
                                    {sender.email}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-xs text-muted-foreground">
                        or enter manually
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="from-name">
                        From name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="from-name"
                        value={data.fromName}
                        onChange={handleFromNameChange}
                        placeholder="Company name"
                        className={errors.fromName ? 'border-destructive' : ''}
                    />
                    {errors.fromName && (
                        <p className="text-xs text-destructive">{errors.fromName}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="from-email">
                        From email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="from-email"
                        type="email"
                        value={data.fromEmail}
                        onChange={handleFromEmailChange}
                        placeholder="you@company.com"
                        className={errors.fromEmail ? 'border-destructive' : ''}
                    />
                    {errors.fromEmail && (
                        <p className="text-xs text-destructive">{errors.fromEmail}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="reply-to">
                    Reply-to email{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="reply-to"
                    type="email"
                    value={data.replyTo}
                    onChange={handleReplyToChange}
                    placeholder="replies@company.com"
                />
                <p className="text-xs text-muted-foreground">
                    Leave blank to use From email as reply-to.
                </p>
            </div>
        </div>
    );
}

export { MOCK_SENDERS };