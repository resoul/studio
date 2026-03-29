import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmailTemplate } from '@/types/email-builder';
import { exportToHtml } from '@/utils/exportHtml';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate;
  includeGoogleFonts?: boolean;
}

export function PreviewModal({ open, onOpenChange, template, includeGoogleFonts = true }: PreviewModalProps) {
  const html = exportToHtml(template, { includeGoogleFonts });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto rounded-md border border-border bg-card">
          <iframe
            srcDoc={html}
            className="w-full h-full border-0"
            title="Email Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
