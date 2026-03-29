import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { EmailTemplate } from '@/types/email-builder';
import { generateMockTemplate } from '@/utils/aiTemplateMock';

interface AIGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (template: EmailTemplate) => void;
}

const presetPrompts = [
  { label: '🎉 Welcome Email', prompt: 'Create a welcome email for new users signing up to a SaaS product. Include a greeting, key features, and a CTA to get started.' },
  { label: '📰 Newsletter', prompt: 'Create a weekly newsletter template with a header, featured article section, 3 article summaries in a grid, and a footer with social links.' },
  { label: '🛍️ Promotion', prompt: 'Create a promotional email for a seasonal sale with a bold headline, hero image, discount code, product highlights, and a shop now button.' },
  { label: '📋 Transactional', prompt: 'Create a transactional email template for order confirmation with order details, shipping info, and customer support link.' },
];

export function AIGenerateModal({ open, onOpenChange, onGenerate }: AIGenerateModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Simulate AI generation delay (mock for now)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const template = generateMockTemplate(prompt);
    onGenerate(template);
    onOpenChange(false);
    setIsGenerating(false);
    setPrompt('');
  };

  const handlePreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isGenerating) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Generate with AI
          </DialogTitle>
          <DialogDescription>
            Describe the email you want to create, and AI will generate a template for you.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Preset prompts */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick prompts</p>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map(p => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.prompt)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/[0.05] hover:border-primary/50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your email template... e.g., 'A product launch email with a hero image, feature highlights, testimonial, and CTA button'"
              className="min-h-[120px] resize-none"
              disabled={isGenerating}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Generate Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
