import { useCallback, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CampaignFormData, ScheduleType, StepErrors } from '@/types/campaign';
import { SendHorizonal, CalendarClock } from 'lucide-react';

const TIMEZONES = [
    'UTC',
    'Europe/Kiev',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'America/New_York',
    'America/Chicago',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Asia/Singapore',
    'Australia/Sydney',
];

interface ScheduleOption {
    value: ScheduleType;
    label: string;
    description: string;
    Icon: React.ElementType;
}

const SCHEDULE_OPTIONS: ScheduleOption[] = [
    {
        value: 'now',
        label: 'Send now',
        description: 'Send immediately after review',
        Icon: SendHorizonal,
    },
    {
        value: 'later',
        label: 'Schedule for later',
        description: 'Pick a specific date and time',
        Icon: CalendarClock,
    },
];

interface StepScheduleProps {
    data: CampaignFormData;
    errors: StepErrors;
    onChange: (patch: Partial<CampaignFormData>) => void;
}

export function StepSchedule({ data, errors, onChange }: StepScheduleProps) {
    const handleScheduleTypeChange = useCallback(
        (type: ScheduleType) => onChange({ scheduleType: type }),
        [onChange],
    );

    const handleDateChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ sendDate: e.target.value }),
        [onChange],
    );

    const handleTimeChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onChange({ sendTime: e.target.value }),
        [onChange],
    );

    const handleTimezoneChange = useCallback(
        (tz: string) => onChange({ timezone: tz }),
        [onChange],
    );

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Schedule</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Choose when to send this campaign.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {SCHEDULE_OPTIONS.map(({ value, label, description, Icon }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleScheduleTypeChange(value)}
                        className={[
                            'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors',
                            data.scheduleType === value
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50',
                        ].join(' ')}
                    >
                        <Icon
                            className={[
                                'h-4 w-4',
                                data.scheduleType === value
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                            ].join(' ')}
                        />
                        <div>
                            <p
                                className={[
                                    'text-sm font-medium',
                                    data.scheduleType === value
                                        ? 'text-primary'
                                        : 'text-foreground',
                                ].join(' ')}
                            >
                                {label}
                            </p>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {data.scheduleType === 'later' && (
                <div className="space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="send-date">
                                Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="send-date"
                                type="date"
                                value={data.sendDate}
                                min={today}
                                onChange={handleDateChange}
                                className={errors.sendDate ? 'border-destructive' : ''}
                            />
                            {errors.sendDate && (
                                <p className="text-xs text-destructive">{errors.sendDate}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="send-time">
                                Time <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="send-time"
                                type="time"
                                value={data.sendTime}
                                onChange={handleTimeChange}
                                className={errors.sendTime ? 'border-destructive' : ''}
                            />
                            {errors.sendTime && (
                                <p className="text-xs text-destructive">{errors.sendTime}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Timezone</Label>
                        <Select value={data.timezone} onValueChange={handleTimezoneChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TIMEZONES.map((tz) => (
                                    <SelectItem key={tz} value={tz}>
                                        {tz}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
}