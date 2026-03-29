import { useCallback, ChangeEvent } from 'react';
import { HtmlBlock } from '@/types/email-builder';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HtmlPropsProps {
    block: HtmlBlock;
    onUpdate: (updates: Partial<HtmlBlock>) => void;
}

export function HtmlProps({ block, onUpdate }: HtmlPropsProps) {
    const handleContent = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => onUpdate({ content: e.target.value }),
        [onUpdate],
    );

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">HTML Code</Label>
                <Textarea
                    value={block.content}
                    onChange={handleContent}
                    className="mt-1 font-mono text-xs"
                    rows={10}
                    placeholder="<div>Your HTML here</div>"
                />
            </div>
            <p className="text-xs text-muted-foreground">
                Paste any HTML — tables, divs, custom layouts. It will render as-is in the email.
            </p>
        </div>
    );
}