import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp, AlertCircle } from 'lucide-react';
import { EmailTemplate } from '@/types/email-builder';
import { parseHtmlToTemplate } from '@/utils/parseHtml';

interface UploadHtmlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (template: EmailTemplate) => void;
}

export function UploadHtmlModal({ open, onOpenChange, onImport }: UploadHtmlModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setError(null);
    setFileName(null);
    setHtmlContent(null);
  };

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
      setError('Please upload an HTML file (.html or .htm)');
      return;
    }
    if (file.size > 500_000) {
      setError('File is too large (max 500KB)');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setHtmlContent(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!htmlContent) return;
    try {
      const template = parseHtmlToTemplate(htmlContent);
      onImport(template);
      onOpenChange(false);
      reset();
    } catch {
      setError('Failed to parse the HTML file. Please check the format.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload HTML Template</DialogTitle>
          <DialogDescription>Import an existing HTML email file to edit in the builder.</DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="mt-2 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-10 cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/[0.02]"
        >
          <FileUp className="h-8 w-8 text-muted-foreground" />
          {fileName ? (
            <p className="text-sm font-medium text-foreground">{fileName}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">Drop your HTML file here</p>
              <p className="text-xs text-muted-foreground">or click to browse</p>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".html,.htm,text/html"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-3">
          <Button variant="ghost" size="sm" onClick={() => { onOpenChange(false); reset(); }}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleImport} disabled={!htmlContent}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
