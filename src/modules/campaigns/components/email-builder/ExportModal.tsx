import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EmailTemplate } from '@/types/email-builder';
import { exportToHtml } from '@/utils/exportHtml';
import { Check, Copy, Download } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate;
  includeGoogleFonts?: boolean;
  fileName?: string;
}

export function ExportModal({
  open,
  onOpenChange,
  template,
  includeGoogleFonts = true,
  fileName = 'email-template.html',
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const html = exportToHtml(template, { includeGoogleFonts });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.trim() ? fileName.trim() : 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Export HTML</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-2">
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        <pre className="flex-1 overflow-auto rounded-md border border-border bg-secondary p-4 text-xs font-mono text-foreground whitespace-pre-wrap">
          {html}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
