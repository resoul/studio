import { Download, Link2, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fmtDims, fmtSize } from '@/utils/storage';
import type { MediaFile } from '@/types/storage';

interface PreviewModalProps {
    file: MediaFile | null;
    onClose: () => void;
}

export function PreviewModal({ file, onClose }: PreviewModalProps) {
    if (!file) return null;

    return (
        <Dialog open={!!file} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                <div className="flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                        <div>
                            <p className="text-sm font-semibold text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {fmtDims(file.width, file.height)} · {fmtSize(file.size)} · {file.type.toUpperCase()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a href={file.url} download={file.name}>
                                    <Download className="h-3.5 w-3.5 mr-1.5" />Download
                                </a>
                            </Button>
                            <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-secondary/30 flex items-center justify-center p-6">
                        <img
                            src={file.url}
                            alt={file.alt}
                            className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl"
                        />
                    </div>

                    <div className="px-5 py-4 border-t border-border shrink-0 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                            <p className="text-sm text-foreground capitalize">{file.source}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Alt text</p>
                            <p className="text-sm text-foreground">{file.alt || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {file.tags.map(t => (
                                    <span key={t} className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-5 pb-4 shrink-0">
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-3 py-2">
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <p className="flex-1 text-xs font-mono text-muted-foreground truncate">{file.url}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(file.url)}
                                className="shrink-0 rounded px-2 py-1 text-xs text-primary hover:bg-primary/10 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
