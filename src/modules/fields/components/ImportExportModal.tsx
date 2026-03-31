import { useState, useCallback, useRef } from 'react';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button }   from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomField, FieldType, FieldEntity, FIELD_TYPE_LABELS } from '@/types/fields';
import { FieldTypeIcon } from './FieldTypeIcon';
import { Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── helpers ───────────────────────────────────────────────────────────────────

function fieldsToJson(fields: CustomField[]): string {
    return JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fields.map(({ id: _id, ...f }) => f),
        null,
        2,
    );
}

function fieldsToCsv(fields: CustomField[]): string {
    const headers = ['key', 'label', 'type', 'entity', 'required', 'description'];
    const rows = fields.map(f =>
        [f.key, f.label, f.type, f.entity, f.required, f.description]
            .map(v => `"${String(v).replace(/"/g, '""')}"`)
            .join(','),
    );
    return [headers.join(','), ...rows].join('\n');
}

function inferType(header: string): FieldType {
    const h = header.toLowerCase();
    if (/email/i.test(h))               return 'email';
    if (/phone|tel/i.test(h))           return 'phone';
    if (/url|website|link/i.test(h))    return 'url';
    if (/date|birthday|born/i.test(h))  return 'date';
    if (/count|num|qty|amount/i.test(h))return 'number';
    if (/note|comment|bio|desc/i.test(h))return 'textarea';
    if (/opt_?in|consent|subscribe/i.test(h)) return 'boolean';
    return 'text';
}

function csvHeadersToFields(csv: string, existingKeys: string[], nextOrder: number): CustomField[] {
    const lines = csv.trim().split(/\r?\n/);
    const firstLine = lines[0];
    // Try comma or semicolon delimiter
    const delim = firstLine.includes(';') ? ';' : ',';
    const headers = firstLine.split(delim).map(h =>
        h.trim().replace(/^["']|["']$/g, '').toLowerCase().replace(/\s+/g, '_'),
    );

    const now = new Date().toISOString().split('T')[0];
    let order = nextOrder;

    return headers
        .filter(key => key && !existingKeys.includes(key))
        .map(key => ({
            id:           `cf-import-${Date.now()}-${key}`,
            key,
            label:        key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            type:         inferType(key),
            entity:       'contact' as FieldEntity,
            required:     false,
            system:       false,
            description:  '',
            placeholder:  '',
            defaultValue: '',
            options:      [],
            order:        order++,
            createdAt:    now,
        }));
}

function downloadString(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ImportExportModalProps {
    open:         boolean;
    onOpenChange: (open: boolean) => void;
    fields:       CustomField[];
    existingKeys: string[];
    nextOrder:    number;
    onImport:     (fields: CustomField[]) => void;
}

export function ImportExportModal({
                                      open, onOpenChange, fields, existingKeys, nextOrder, onImport,
                                  }: ImportExportModalProps) {
    const [tab,         setTab]         = useState('export');
    const [copied,      setCopied]      = useState(false);
    const [importText,  setImportText]  = useState('');
    const [preview,     setPreview]     = useState<CustomField[]>([]);
    const [importError, setImportError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Export ────────────────────────────────────────────────────────────
    const jsonStr = fieldsToJson(fields);
    const csvStr  = fieldsToCsv(fields);

    const handleCopyJson = useCallback(async () => {
        await navigator.clipboard.writeText(jsonStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [jsonStr]);

    const handleDownloadJson = useCallback(() => {
        downloadString(jsonStr, 'fields-schema.json', 'application/json');
    }, [jsonStr]);

    const handleDownloadCsv = useCallback(() => {
        downloadString(csvStr, 'fields-schema.csv', 'text/csv');
    }, [csvStr]);

    // ── Import ────────────────────────────────────────────────────────────
    const parseImport = useCallback((text: string) => {
        setImportError('');
        if (!text.trim()) { setPreview([]); return; }

        try {
            // Try JSON first
            if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
                const arr: CustomField[] = JSON.parse(text);
                const list = Array.isArray(arr) ? arr : [arr];
                const deduped = list.filter(f => !existingKeys.includes(f.key));
                setPreview(deduped.map((f, i) => ({
                    ...f,
                    id: `cf-import-${Date.now()}-${i}`,
                    order: nextOrder + i,
                    system: false,
                    createdAt: f.createdAt ?? new Date().toISOString().split('T')[0],
                })));
                return;
            }
            // Treat as CSV headers
            const parsed = csvHeadersToFields(text, existingKeys, nextOrder);
            setPreview(parsed);
        } catch {
            setImportError('Could not parse input. Paste valid JSON schema or CSV headers.');
            setPreview([]);
        }
    }, [existingKeys, nextOrder]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const v = e.target.value;
        setImportText(v);
        parseImport(v);
    }, [parseImport]);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setImportText(text);
            parseImport(text);
        };
        reader.readAsText(file);
        e.target.value = '';
    }, [parseImport]);

    const handleConfirmImport = useCallback(() => {
        if (preview.length === 0) return;
        onImport(preview);
        setImportText('');
        setPreview([]);
        onOpenChange(false);
    }, [preview, onImport, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Import / Export fields</DialogTitle>
                    <DialogDescription>
                        Export your field schema as JSON or CSV, or import from CSV column headers.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab} className="flex-1 overflow-hidden flex flex-col">
                    <TabsList className="shrink-0">
                        <TabsTrigger value="export" className="flex items-center gap-1.5">
                            <Download className="h-3.5 w-3.5" /> Export
                        </TabsTrigger>
                        <TabsTrigger value="import" className="flex items-center gap-1.5">
                            <Upload className="h-3.5 w-3.5" /> Import
                        </TabsTrigger>
                    </TabsList>

                    {/* ── EXPORT ─────────────────────────────────────────── */}
                    <TabsContent value="export" className="flex-1 overflow-y-auto mt-3 space-y-4">
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handleDownloadJson}>
                                <Download className="h-3.5 w-3.5" /> Download JSON
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleDownloadCsv}>
                                <Download className="h-3.5 w-3.5" /> Download CSV
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCopyJson} className="ml-auto">
                                {copied
                                    ? <><Check className="h-3.5 w-3.5 text-green-600" /> Copied</>
                                    : <><Copy className="h-3.5 w-3.5" /> Copy JSON</>
                                }
                            </Button>
                        </div>

                        <pre className="text-xs font-mono bg-muted/40 rounded-lg p-4 overflow-auto max-h-80 border border-border whitespace-pre-wrap break-all">
                            {jsonStr}
                        </pre>
                    </TabsContent>

                    {/* ── IMPORT ─────────────────────────────────────────── */}
                    <TabsContent value="import" className="flex-1 overflow-y-auto mt-3 space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground">
                                Paste CSV headers (e.g. <code className="font-mono bg-muted px-1 rounded">first_name,company,plan</code>) or
                                a full JSON schema array. Fields that already exist (by key) will be skipped.
                            </p>
                            <textarea
                                value={importText}
                                onChange={handleTextChange}
                                rows={5}
                                placeholder={'first_name,company,plan,mrr\nor paste JSON schema…'}
                                className="w-full rounded-md border border-input bg-background text-sm font-mono px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <Upload className="h-3.5 w-3.5" /> Upload file (.csv / .json)
                                </Button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,.json,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {importError && (
                            <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {importError}
                            </div>
                        )}

                        {/* Preview */}
                        {preview.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-foreground">
                                    {preview.length} field{preview.length !== 1 ? 's' : ''} to import:
                                </p>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {preview.map((f) => (
                                        <div
                                            key={f.key}
                                            className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
                                        >
                                            <FieldTypeIcon type={f.type} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{f.label}</p>
                                                <p className="text-[11px] text-muted-foreground font-mono">{f.key}</p>
                                            </div>
                                            <span className={cn(
                                                'text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5',
                                            )}>
                                                {FIELD_TYPE_LABELS[f.type]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button
                                onClick={handleConfirmImport}
                                disabled={preview.length === 0}
                            >
                                Import {preview.length > 0 ? `${preview.length} field${preview.length !== 1 ? 's' : ''}` : ''}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}