import { useCallback } from 'react';
import { Eye, Code } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { EmailBuilderSheet } from './EmailBuilderSheet';

interface PreviewExportSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    includeGoogleFonts: boolean;
    onIncludeGoogleFontsChange: (value: boolean) => void;
    exportFileName: string;
    onExportFileNameChange: (value: string) => void;
    onOpenPreview: () => void;
    onOpenExport: () => void;
}

export function PreviewExportSheet({
    open,
    onOpenChange,
    includeGoogleFonts,
    onIncludeGoogleFontsChange,
    exportFileName,
    onExportFileNameChange,
    onOpenPreview,
    onOpenExport,
}: PreviewExportSheetProps) {
    const handlePreviewClick = useCallback(() => {
        onOpenChange(false);
        onOpenPreview();
    }, [onOpenChange, onOpenPreview]);

    const handleExportClick = useCallback(() => {
        onOpenChange(false);
        onOpenExport();
    }, [onOpenChange, onOpenExport]);

    return (
        <EmailBuilderSheet
            open={open}
            onOpenChange={onOpenChange}
            side="right"
            className="w-full max-w-md"
            title="Preview & Export"
            description="Choose output settings before opening preview or exporting HTML."
        >
            <div className="space-y-4">
                <div className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label htmlFor="include-google-fonts" className="text-sm font-medium">Include Google Fonts</Label>
                            <p className="text-xs text-muted-foreground">Adds Google Fonts link tags when selected font is from Google.</p>
                        </div>
                        <Switch
                            id="include-google-fonts"
                            checked={includeGoogleFonts}
                            onCheckedChange={onIncludeGoogleFontsChange}
                        />
                    </div>
                </div>

                <div className="rounded-md border border-border p-3">
                    <Label htmlFor="export-file-name" className="text-sm font-medium">Export File Name</Label>
                    <Input
                        id="export-file-name"
                        value={exportFileName}
                        onChange={(e) => onExportFileNameChange(e.target.value)}
                        className="mt-2"
                        placeholder="email-template.html"
                    />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button variant="outline" onClick={handlePreviewClick}>
                        <Eye className="mr-1.5 h-4 w-4" />
                        Open Preview
                    </Button>
                    <Button onClick={handleExportClick}>
                        <Code className="mr-1.5 h-4 w-4" />
                        Open Export
                    </Button>
                </div>
            </div>
        </EmailBuilderSheet>
    );
}
