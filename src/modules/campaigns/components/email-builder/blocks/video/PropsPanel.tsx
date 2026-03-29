import { useCallback, ChangeEvent } from 'react';
import { VideoBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorInput, AlignSelect } from '@/modules/campaigns/components/email-builder/properties-panel/shared';
import { getAutoThumbnail } from './utils';

interface VideoPropsProps {
    block: VideoBlock;
    onUpdate: (updates: Partial<VideoBlock>) => void;
}

export function VideoProps({ block, onUpdate }: VideoPropsProps) {
    const handleUrlChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const url = e.target.value;
            onUpdate({ url, thumbnailUrl: block.thumbnailUrl || getAutoThumbnail(url) });
        },
        [block.thumbnailUrl, onUpdate],
    );

    const handleAutoThumbnail = useCallback(
        () => onUpdate({ thumbnailUrl: getAutoThumbnail(block.url) }),
        [block.url, onUpdate],
    );

    const handleThumbChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onUpdate({ thumbnailUrl: e.target.value }),
        [onUpdate],
    );
    const handleAltChange   = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onUpdate({ altText: e.target.value }),
        [onUpdate],
    );
    const handleWidthChange = useCallback((v: number[]) => onUpdate({ width: v[0] }),             [onUpdate]);
    const handlePlayBg      = useCallback((v: string)   => onUpdate({ playButtonBgColor: v }),    [onUpdate]);
    const handlePlayColor   = useCallback((v: string)   => onUpdate({ playButtonColor: v }),      [onUpdate]);
    const handleShowPlay    = useCallback((v: boolean)  => onUpdate({ showPlayButton: v }),       [onUpdate]);
    const handleAlign       = useCallback(
        (v: string) => onUpdate({ align: v as VideoBlock['align'] }),
        [onUpdate],
    );

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Video URL</Label>
                <Input
                    value={block.url}
                    onChange={handleUrlChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mt-1"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                    YouTube & Vimeo URLs supported. Thumbnail is auto-extracted.
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">Thumbnail URL</Label>
                    <button
                        onClick={handleAutoThumbnail}
                        className="text-[10px] text-primary hover:underline"
                    >
                        Auto-detect
                    </button>
                </div>
                <Input
                    value={block.thumbnailUrl}
                    onChange={handleThumbChange}
                    placeholder="https://img.youtube.com/vi/…"
                    className="font-mono text-xs"
                />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Alt Text</Label>
                <Input
                    value={block.altText}
                    onChange={handleAltChange}
                    className="mt-1"
                    placeholder="Video thumbnail"
                />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Width: {block.width}%</Label>
                <Slider
                    value={[block.width]}
                    onValueChange={handleWidthChange}
                    min={30}
                    max={100}
                    step={5}
                    className="mt-2"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Show play button</Label>
                <Switch checked={block.showPlayButton} onCheckedChange={handleShowPlay} />
            </div>

            {block.showPlayButton && (
                <>
                    <ColorInput label="Play button background" value={block.playButtonBgColor} onChange={handlePlayBg} />
                    <ColorInput label="Play button icon color"  value={block.playButtonColor}   onChange={handlePlayColor} />
                </>
            )}

            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}