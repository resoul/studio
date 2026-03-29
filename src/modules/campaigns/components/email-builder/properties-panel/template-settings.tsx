import { ChangeEvent, useCallback } from 'react';
import { EmailTemplate } from '@/types/email-builder';
import { EMAIL_FONT_CONFIG } from '@/config/email-fonts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function TemplateSettings({
    template,
    onUpdate,
}: {
    template: EmailTemplate;
    onUpdate: (u: Partial<EmailTemplate>) => void;
}) {
    const handleFontFamilyChange = useCallback((v: string) => onUpdate({ fontFamily: v }), [onUpdate]);
    const handleBgColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ bgColor: e.target.value }), [onUpdate]);
    const handleContentWidthChange = useCallback((v: number[]) => onUpdate({ contentWidth: v[0] }), [onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Font Family</Label>
                <Select value={template.fontFamily} onValueChange={handleFontFamilyChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {EMAIL_FONT_CONFIG.map((f) => (
                            <SelectItem key={f.key} value={f.cssStack}>
                                <span style={{ fontFamily: f.cssStack }}>{f.label}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Background Color</Label>
                <div className="flex gap-2 mt-1">
                    <input
                        type="color"
                        value={template.bgColor}
                        onChange={handleBgColorChange}
                        className="h-9 w-9 rounded border border-border cursor-pointer"
                    />
                    <Input
                        value={template.bgColor}
                        onChange={handleBgColorChange}
                        className="flex-1 font-mono text-xs"
                    />
                </div>
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Content Width: {template.contentWidth}px</Label>
                <Slider
                    value={[template.contentWidth]}
                    onValueChange={handleContentWidthChange}
                    min={400}
                    max={800}
                    step={10}
                    className="mt-2"
                />
            </div>
        </div>
    );
}
