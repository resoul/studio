import { useCallback } from 'react';
import { SurveyBlock, SurveyType } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlignSelect, ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

const SURVEY_TYPES: { value: SurveyType; label: string; emoji: string }[] = [
    { value: 'stars', label: 'Star Rating', emoji: '⭐' },
    { value: 'nps',   label: 'NPS (0–10)',  emoji: '📊' },
    { value: 'thumbs',label: 'Thumbs',      emoji: '👍' },
];

interface SurveyPropsProps {
    block: SurveyBlock;
    onUpdate: (updates: Partial<SurveyBlock>) => void;
}

export function SurveyProps({ block, onUpdate }: SurveyPropsProps) {
    const handleSurveyType = useCallback((v: string) => onUpdate({ surveyType: v as SurveyType }), [onUpdate]);
    const handleStarCount = useCallback((v: number[]) => onUpdate({ starCount: v[0] }), [onUpdate]);
    const handleAlign = useCallback((v: string) => onUpdate({ align: v as SurveyBlock['align'] }), [onUpdate]);
    const handleStarColor = useCallback((v: string) => onUpdate({ starColor: v }), [onUpdate]);
    const handleTextColor = useCallback((v: string) => onUpdate({ textColor: v }), [onUpdate]);

    return (
        <div className="space-y-4">
            {/* Survey type */}
            <div>
                <Label className="text-xs text-muted-foreground">Rating Style</Label>
                <Select value={block.surveyType} onValueChange={handleSurveyType}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {SURVEY_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value}>
                                {t.emoji} {t.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Question */}
            <div>
                <Label className="text-xs text-muted-foreground">Question</Label>
                <Input
                    value={block.question}
                    onChange={e => onUpdate({ question: e.target.value })}
                    placeholder="How would you rate your experience?"
                    className="mt-1"
                />
            </div>

            {/* Base URL */}
            <div>
                <Label className="text-xs text-muted-foreground">Tracking URL</Label>
                <Input
                    value={block.baseUrl}
                    onChange={e => onUpdate({ baseUrl: e.target.value })}
                    placeholder="https://example.com/survey?rating="
                    className="mt-1 font-mono text-xs"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                    Rating value is appended automatically (e.g. …?rating=4)
                </p>
            </div>

            {/* Star count — only for stars */}
            {block.surveyType === 'stars' && (
                <div>
                    <Label className="text-xs text-muted-foreground">
                        Number of Stars: {block.starCount}
                    </Label>
                    <Slider
                        value={[block.starCount]}
                        onValueChange={handleStarCount}
                        min={3}
                        max={10}
                        step={1}
                        className="mt-2"
                    />
                </div>
            )}

            {/* NPS labels */}
            {block.surveyType === 'nps' && (
                <>
                    <div>
                        <Label className="text-xs text-muted-foreground">Label — Low end (0)</Label>
                        <Input
                            value={block.labelLow}
                            onChange={e => onUpdate({ labelLow: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Label — High end (10)</Label>
                        <Input
                            value={block.labelHigh}
                            onChange={e => onUpdate({ labelHigh: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                </>
            )}

            {/* Colors */}
            <ColorInput
                label={block.surveyType === 'stars' ? 'Star Color' : block.surveyType === 'nps' ? 'Highlight Color' : 'Thumbs Color'}
                value={block.starColor}
                onChange={handleStarColor}
            />
            <ColorInput label="Text Color" value={block.textColor} onChange={handleTextColor} />

            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}