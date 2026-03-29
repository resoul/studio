import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Contact, ImportResult } from '@/types/contacts';
import { FileUp, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImportContactsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    listId: string;
    onImported: (contacts: Contact[]) => void;
}

function detectColumn(headers: string[], candidates: string[]): number {
    for (const candidate of candidates) {
        const idx = headers.findIndex((h) => h.toLowerCase().includes(candidate));
        if (idx !== -1) return idx;
    }
    return -1;
}

function parseCsvText(text: string, listId: string): { contacts: Contact[]; skipped: number; errors: string[] } {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return { contacts: [], skipped: 0, errors: ['File has no data rows.'] };

    const rawHeaders = lines[0].split(',').map((h) => h.replace(/['"]/g, '').trim());

    const emailIdx     = detectColumn(rawHeaders, ['email', 'e-mail', 'mail']);
    const firstNameIdx = detectColumn(rawHeaders, ['first', 'firstname', 'given']);
    const lastNameIdx  = detectColumn(rawHeaders, ['last', 'lastname', 'surname', 'family']);
    const phoneIdx     = detectColumn(rawHeaders, ['phone', 'mobile', 'tel']);
    const nameIdx      = detectColumn(rawHeaders, ['name', 'full']);

    const contacts: Contact[] = [];
    const errors: string[] = [];
    let skipped = 0;

    lines.slice(1).forEach((line, i) => {
        const cols = line.split(',').map((c) => c.replace(/['"]/g, '').trim());
        const email = emailIdx !== -1 ? cols[emailIdx] : '';

        if (!email || !email.includes('@')) {
            skipped++;
            if (!email) errors.push(`Row ${i + 2}: missing email — skipped`);
            else errors.push(`Row ${i + 2}: invalid email "${email}" — skipped`);
            return;
        }

        let firstName = firstNameIdx !== -1 ? cols[firstNameIdx] : '';
        let lastName  = lastNameIdx  !== -1 ? cols[lastNameIdx]  : '';

        if (!firstName && nameIdx !== -1) {
            const parts = (cols[nameIdx] || '').split(' ');
            firstName = parts[0] || '';
            lastName  = parts.slice(1).join(' ');
        }

        contacts.push({
            id: `imported-${Date.now()}-${i}`,
            listId,
            firstName: firstName || email.split('@')[0],
            lastName,
            email,
            phone: phoneIdx !== -1 ? cols[phoneIdx] : '',
            status: 'active',
            addedAt: new Date().toISOString().split('T')[0],
            tags: [],
        });
    });

    return { contacts, skipped, errors };
}

interface FileEntry {
    file: File;
    status: 'pending' | 'parsing' | 'done' | 'error';
    result?: ImportResult;
    contacts?: Contact[];
}

export function ImportContactsModal({ open, onOpenChange, listId, onImported }: ImportContactsModalProps) {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [importDone, setImportDone] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const addFiles = useCallback((incoming: File[]) => {
        const csvFiles = incoming.filter(
            (f) => f.name.endsWith('.csv') || f.type === 'text/csv' || f.name.endsWith('.txt'),
        );
        if (csvFiles.length === 0) return;
        setFiles((prev) => {
            const existingNames = new Set(prev.map((e) => e.file.name));
            const newEntries: FileEntry[] = csvFiles
                .filter((f) => !existingNames.has(f.name))
                .map((f) => ({ file: f, status: 'pending' }));
            return [...prev, ...newEntries];
        });
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    }, [addFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => setIsDragging(false), []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(Array.from(e.target.files));
    }, [addFiles]);

    const removeFile = useCallback((idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    }, []);

    const handleImport = useCallback(async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        const allContacts: Contact[] = [];

        for (let i = 0; i < files.length; i++) {
            setFiles((prev) => prev.map((e, idx) => idx === i ? { ...e, status: 'parsing' } : e));

            try {
                const text = await files[i].file.text();
                const { contacts, skipped, errors } = parseCsvText(text, listId);

                allContacts.push(...contacts);
                setFiles((prev) =>
                    prev.map((e, idx) =>
                        idx === i
                            ? { ...e, status: 'done', contacts, result: { imported: contacts.length, skipped, errors } }
                            : e,
                    ),
                );
            } catch {
                setFiles((prev) =>
                    prev.map((e, idx) =>
                        idx === i
                            ? { ...e, status: 'error', result: { imported: 0, skipped: 0, errors: ['Failed to read file.'] } }
                            : e,
                    ),
                );
            }
        }

        setIsProcessing(false);
        setImportDone(true);
        onImported(allContacts);
    }, [files, listId, onImported]);

    const handleClose = useCallback(() => {
        onOpenChange(false);
        setFiles([]);
        setImportDone(false);
        setIsProcessing(false);
    }, [onOpenChange]);

    const totalImported = files.reduce((sum, f) => sum + (f.result?.imported ?? 0), 0);
    const totalSkipped  = files.reduce((sum, f) => sum + (f.result?.skipped  ?? 0), 0);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Import contacts</DialogTitle>
                    <DialogDescription>
                        Upload one or more CSV files. Columns detected automatically: email, first_name, last_name, phone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Drop zone */}
                    {!importDone && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileRef.current?.click()}
                            className={[
                                'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors py-8 px-4',
                                isDragging
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 hover:bg-secondary/30',
                            ].join(' ')}
                        >
                            <FileUp className="h-7 w-7 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">
                                Drop CSV files here or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Multiple files supported · .csv and .txt
                            </p>
                        </div>
                    )}

                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv,.txt,text/csv"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                    />

                    {/* File list */}
                    {files.length > 0 && (
                        <div className="space-y-2 max-h-52 overflow-y-auto">
                            {files.map((entry, idx) => (
                                <div
                                    key={entry.file.name}
                                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {entry.status === 'parsing' && (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        )}
                                        {entry.status === 'done' && (
                                            <CheckCircle className="h-4 w-4 text-accent" />
                                        )}
                                        {entry.status === 'error' && (
                                            <AlertCircle className="h-4 w-4 text-destructive" />
                                        )}
                                        {entry.status === 'pending' && (
                                            <div className="h-4 w-4 rounded-full border-2 border-border" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {entry.file.name}
                                        </p>
                                        {entry.result && (
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {entry.result.imported} imported
                                                {entry.result.skipped > 0 && ` · ${entry.result.skipped} skipped`}
                                            </p>
                                        )}
                                        {entry.result?.errors && entry.result.errors.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {entry.result.errors.slice(0, 3).map((err, i) => (
                                                    <li key={i} className="text-[11px] text-destructive">
                                                        {err}
                                                    </li>
                                                ))}
                                                {entry.result.errors.length > 3 && (
                                                    <li className="text-[11px] text-muted-foreground">
                                                        +{entry.result.errors.length - 3} more issues
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    {!isProcessing && !importDone && (
                                        <button
                                            onClick={() => removeFile(idx)}
                                            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary after import */}
                    {importDone && (
                        <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                            <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    Import complete
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {totalImported} contacts added
                                    {totalSkipped > 0 && ` · ${totalSkipped} skipped`}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleClose}>
                            {importDone ? 'Close' : 'Cancel'}
                        </Button>
                        {!importDone && (
                            <Button
                                onClick={handleImport}
                                disabled={files.length === 0 || isProcessing}
                            >
                                {isProcessing && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                                {isProcessing ? 'Importing…' : `Import ${files.length > 0 ? `(${files.length} file${files.length > 1 ? 's' : ''})` : ''}`}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}