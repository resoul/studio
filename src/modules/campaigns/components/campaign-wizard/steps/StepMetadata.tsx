import { useCallback, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CampaignFormData, CampaignType, StepErrors } from '@/types/campaign';
import { Mail, FlaskConical, Zap, Rss } from 'lucide-react';

interface StepMetadataProps {
    data: CampaignFormData;
    errors: StepErrors;
    onChange: (patch: Partial<CampaignFormData>) => void;
}

interface TypeOption {
    value: CampaignType;
    label: string;
    description: string;
    Icon: React.ElementType;
}

const TYPE_OPTIONS: TypeOption[] = [
    {
        value: 'regular',
        label: 'Regular',
        description: 'One-time send to a list',
        Icon: Mail,
    },
    {
        value: 'ab',
        label: 'A/B test',
        description: 'Test subjects or content',
        Icon: FlaskConical,
    },
    {
        value: 'automated',
        label: 'Automated',
        description: 'Trigger-based sending',
        Icon: Zap,
    },
    {
        value: 'rss',
        label: 'RSS',
        description: 'Auto-send from a feed',
        Icon: Rss,
    },
];

export function StepMetadata({ data, errors, onChange }: StepMetadataProps) {
    const handleNameChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ name: e.target.value }),
        [onChange],
    );

    const handleTypeSelect = useCallback(
        (type: CampaignType) => onChange({ type }),
        [onChange],
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Campaign details</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Start by giving your campaign a name and picking a type.
                </p>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="campaign-name">
                    Campaign name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="campaign-name"
                    value={data.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Spring sale 2025"
                    className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                    autoFocus
                />
                {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label>Campaign type</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {TYPE_OPTIONS.map(({ value, label, description, Icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleTypeSelect(value)}
                            className={[
                                'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors',
                                data.type === value
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                                    data.type === value ? 'bg-primary/10' : 'bg-secondary',
                                ].join(' ')}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{label}</p>
                                <p
                                    className={[
                                        'text-xs',
                                        data.type === value
                                            ? 'text-primary/70'
                                            : 'text-muted-foreground',
                                    ].join(' ')}
                                >
                                    {description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}