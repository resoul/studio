import { ChangeEvent, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SocialBlock, SocialLink } from '@/types/email-builder';
import { SOCIAL_NETWORK_CONFIG, SOCIAL_NETWORK_MAP } from '@/config/social-networks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AlignSelect, ColorInput } from './shared';

let uidCounter = 0;
const uid = () => `sl-${++uidCounter}-${Date.now()}`;

function SocialIconPreview({ network, color, size }: { network: string; color: string; size: number }) {
    const cfg = SOCIAL_NETWORK_MAP[network];
    if (!cfg) return null;
    const paths = Array.isArray(cfg.svgPath) ? cfg.svgPath : [cfg.svgPath];
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
        >
            {paths.map((d, i) => <path key={i} d={d} />)}
        </svg>
    );
}

export function SocialProps({ block, onUpdate }: { block: SocialBlock; onUpdate: (u: Partial<SocialBlock>) => void }) {
    const resolvedColor =
        block.iconColor === 'black' ? '#000000'
            : block.iconColor === 'white' ? '#ffffff'
                : block.iconColor === 'custom' ? block.customColor
                    : null;

    const addLink = useCallback(() => {
        const first = SOCIAL_NETWORK_CONFIG[0];
        const newLink: SocialLink = { id: uid(), network: first.key, url: '' };
        onUpdate({ links: [...block.links, newLink] });
    }, [block.links, onUpdate]);

    const removeLink = useCallback((id: string) => {
        onUpdate({ links: block.links.filter((l) => l.id !== id) });
    }, [block.links, onUpdate]);

    const updateLink = useCallback((id: string, patch: Partial<SocialLink>) => {
        onUpdate({ links: block.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
    }, [block.links, onUpdate]);

    const handleIconSizeChange = useCallback((v: number[]) => onUpdate({ iconSize: v[0] }), [onUpdate]);
    const handleGapChange = useCallback((v: number[]) => onUpdate({ gap: v[0] }), [onUpdate]);
    const handleIconColorChange = useCallback((v: string) => onUpdate({ iconColor: v as SocialBlock['iconColor'] }), [onUpdate]);
    const handleAlignChange = useCallback((v: string) => onUpdate({ align: v as 'left' | 'center' | 'right' }), [onUpdate]);
    const handleCustomColorChange = useCallback((v: string) => onUpdate({ customColor: v }), [onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Social Links</Label>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={addLink}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                    </Button>
                </div>

                {block.links.length === 0 && (
                    <p className="text-xs text-muted-foreground py-2 text-center border border-dashed rounded-md">
                        No links yet — click Add
                    </p>
                )}

                <div className="space-y-3">
                    {block.links.map((link) => {
                        const cfg = SOCIAL_NETWORK_MAP[link.network];
                        const previewColor = resolvedColor ?? cfg?.brandColor ?? '#000';
                        const handleNetworkChange = (v: string) => updateLink(link.id, { network: v });
                        const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => updateLink(link.id, { url: e.target.value });
                        const handleRemove = () => removeLink(link.id);

                        return (
                            <div key={link.id} className="rounded-md border border-border p-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="shrink-0">
                                        <SocialIconPreview network={link.network} color={previewColor} size={20} />
                                    </div>

                                    <Select value={link.network} onValueChange={handleNetworkChange}>
                                        <SelectTrigger className="h-7 text-xs flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SOCIAL_NETWORK_CONFIG.map((n) => (
                                                <SelectItem key={n.key} value={n.key}>
                                                    {n.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <button
                                        onClick={handleRemove}
                                        className="shrink-0 rounded p-1 text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <Input
                                    value={link.url}
                                    onChange={handleUrlChange}
                                    placeholder={cfg?.placeholder ?? 'https://...'}
                                    className="h-7 text-xs"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Icon Size: {block.iconSize}px</Label>
                <Slider value={[block.iconSize]} onValueChange={handleIconSizeChange} min={16} max={64} step={4} className="mt-2" />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Gap between icons: {block.gap}px</Label>
                <Slider value={[block.gap]} onValueChange={handleGapChange} min={4} max={32} step={2} className="mt-2" />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Icon Color</Label>
                <Select value={block.iconColor} onValueChange={handleIconColorChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="brand">Brand colors</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {block.iconColor === 'custom' && (
                <ColorInput label="Custom Color" value={block.customColor} onChange={handleCustomColorChange} />
            )}

            <AlignSelect value={block.align} onChange={handleAlignChange} />
        </div>
    );
}
