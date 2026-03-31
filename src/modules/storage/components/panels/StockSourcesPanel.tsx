import { useCallback, useState } from 'react';
import { AlertCircle, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import type { StockSource, StockSourceKey } from '@/types/storage';

interface StockSourcesPanelProps {
    sources: StockSource[];
    onToggle: (key: StockSourceKey) => void;
    onSaveKey: (key: StockSourceKey, apiKey: string) => void;
}

export function StockSourcesPanel({ sources, onToggle, onSaveKey }: StockSourcesPanelProps) {
    const [editKey, setEditKey] = useState<StockSourceKey | null>(null);
    const [keyInput, setKeyInput] = useState('');

    const handleSave = useCallback((key: StockSourceKey) => {
        onSaveKey(key, keyInput);
        setEditKey(null);
        setKeyInput('');
    }, [keyInput, onSaveKey]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-foreground">Stock photo sources</h3>
                <Badge variant="outline" className="text-[10px]">Integrations</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Connect stock photo libraries to browse and import images directly.
            </p>

            {sources.map(src => (
                <div key={src.key} className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl border border-border"
                            style={{ backgroundColor: `${src.color}15` }}
                        >
                            {src.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{src.label}</p>
                                {src.connected && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />Connected
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                                <p className="text-xs text-muted-foreground">{src.description}</p>
                                {src.freeLimit && <span className="text-[10px] text-muted-foreground/60">· {src.freeLimit} free</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <a href={src.website} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <Switch checked={src.connected} onCheckedChange={() => onToggle(src.key)} />
                        </div>
                    </div>

                    {src.requiresApiKey && src.connected && (
                        <div className="space-y-1.5">
                            {editKey === src.key ? (
                                <div className="flex gap-2">
                                    <Input
                                        value={keyInput}
                                        onChange={(e) => setKeyInput(e.target.value)}
                                        placeholder="Paste your API key…"
                                        className="h-8 text-xs font-mono flex-1"
                                        autoFocus
                                    />
                                    <Button size="sm" className="h-8 text-xs" onClick={() => handleSave(src.key)}>Save</Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setEditKey(null)}>Cancel</Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 rounded-lg bg-secondary/30 border border-border px-3 py-2">
                                    <span className="flex-1 text-xs font-mono text-muted-foreground truncate">{src.apiKey || 'No key set'}</span>
                                    <button onClick={() => { setEditKey(src.key); setKeyInput(''); }} className="text-xs text-primary hover:underline shrink-0">
                                        {src.apiKey ? 'Change' : 'Add key'}
                                    </button>
                                </div>
                            )}
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Info className="h-3 w-3 shrink-0" />
                                Get your free key at{' '}
                                <a href={src.website} target="_blank" rel="noopener noreferrer" className="underline">
                                    {src.website.replace('https://', '')}
                                </a>
                            </p>
                        </div>
                    )}

                    {!src.connected && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 bg-secondary/30 rounded-lg px-3 py-2">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {src.requiresApiKey
                                ? 'Enable the toggle to connect. An API key will be required.'
                                : 'Enable the toggle to authorize via OAuth.'}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}