import { useCallback } from 'react';
import { TimerBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ColorInput, AlignSelect } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

interface TimerPropsProps {
    block: TimerBlock;
    onUpdate: (updates: Partial<TimerBlock>) => void;
}

export function TimerProps({ block, onUpdate }: TimerPropsProps) {
    const handleDeadlineChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ deadline: e.target.value }),
        [onUpdate],
    );
    const handleBgColor      = useCallback((v: string) => onUpdate({ bgColor: v }), [onUpdate]);
    const handleDigitBgColor = useCallback((v: string) => onUpdate({ digitBgColor: v }), [onUpdate]);
    const handleDigitColor   = useCallback((v: string) => onUpdate({ digitColor: v }), [onUpdate]);
    const handleLabelColor   = useCallback((v: string) => onUpdate({ labelColor: v }), [onUpdate]);
    const handleSepColor     = useCallback((v: string) => onUpdate({ separatorColor: v }), [onUpdate]);
    const handleAlign        = useCallback((v: string) => onUpdate({ align: v as TimerBlock['align'] }), [onUpdate]);
    const handleShowDays     = useCallback((v: boolean) => onUpdate({ showDays: v }), [onUpdate]);
    const handleShowHours    = useCallback((v: boolean) => onUpdate({ showHours: v }), [onUpdate]);
    const handleShowMinutes  = useCallback((v: boolean) => onUpdate({ showMinutes: v }), [onUpdate]);
    const handleShowSeconds  = useCallback((v: boolean) => onUpdate({ showSeconds: v }), [onUpdate]);

    const handleLabelDays    = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ labels: { ...block.labels, days: e.target.value } }), [block.labels, onUpdate]);
    const handleLabelHours   = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ labels: { ...block.labels, hours: e.target.value } }), [block.labels, onUpdate]);
    const handleLabelMinutes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ labels: { ...block.labels, minutes: e.target.value } }), [block.labels, onUpdate]);
    const handleLabelSeconds = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ labels: { ...block.labels, seconds: e.target.value } }), [block.labels, onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Deadline</Label>
                <Input
                    type="datetime-local"
                    value={block.deadline}
                    onChange={handleDeadlineChange}
                    className="mt-1 text-sm"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                    Note: the timer shows a static snapshot in email (no JS). Use a GIF service for live countdown.
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Show units</Label>
                {[
                    { label: 'Days',    checked: block.showDays,    onChange: handleShowDays    },
                    { label: 'Hours',   checked: block.showHours,   onChange: handleShowHours   },
                    { label: 'Minutes', checked: block.showMinutes, onChange: handleShowMinutes },
                    { label: 'Seconds', checked: block.showSeconds, onChange: handleShowSeconds },
                ].map(({ label, checked, onChange }) => (
                    <div key={label} className="flex items-center justify-between">
                        <span className="text-xs">{label}</span>
                        <Switch checked={checked} onCheckedChange={onChange} />
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Unit labels</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-[10px] text-muted-foreground">Days</Label>
                        <Input value={block.labels.days} onChange={handleLabelDays} className="mt-0.5 h-7 text-xs" />
                    </div>
                    <div>
                        <Label className="text-[10px] text-muted-foreground">Hours</Label>
                        <Input value={block.labels.hours} onChange={handleLabelHours} className="mt-0.5 h-7 text-xs" />
                    </div>
                    <div>
                        <Label className="text-[10px] text-muted-foreground">Minutes</Label>
                        <Input value={block.labels.minutes} onChange={handleLabelMinutes} className="mt-0.5 h-7 text-xs" />
                    </div>
                    <div>
                        <Label className="text-[10px] text-muted-foreground">Seconds</Label>
                        <Input value={block.labels.seconds} onChange={handleLabelSeconds} className="mt-0.5 h-7 text-xs" />
                    </div>
                </div>
            </div>

            <ColorInput label="Background"      value={block.bgColor}       onChange={handleBgColor}      />
            <ColorInput label="Digit background" value={block.digitBgColor}  onChange={handleDigitBgColor} />
            <ColorInput label="Digit color"      value={block.digitColor}    onChange={handleDigitColor}   />
            <ColorInput label="Label color"      value={block.labelColor}    onChange={handleLabelColor}   />
            <ColorInput label="Separator color"  value={block.separatorColor} onChange={handleSepColor}    />
            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}