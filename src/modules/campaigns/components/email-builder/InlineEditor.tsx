import { useRef, useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, Link, Unlink, Type } from 'lucide-react';

interface InlineEditorProps {
  value: string;
  onChange: (html: string) => void;
  style?: React.CSSProperties;
  className?: string;
  tag?: 'div' | 'p' | 'span';
}

interface ToolbarState {
  show: boolean;
  x: number;
  y: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  link: boolean;
}

const COLORS = ['#000000', '#475569', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

function FloatingToolbar({
  state,
  containerRef,
}: {
  state: ToolbarState;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const exec = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    containerRef.current?.focus();
  }, [containerRef]);

  const handleLink = useCallback(() => {
    if (state.link) {
      exec('unlink');
    } else {
      const url = prompt('Enter URL:');
      if (url) exec('createLink', url);
    }
  }, [state.link, exec]);

  if (!state.show) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1 py-1 shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{ left: state.x, top: state.y }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ToolbarButton active={state.bold} onClick={() => exec('bold')} title="Bold">
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton active={state.italic} onClick={() => exec('italic')} title="Italic">
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton active={state.underline} onClick={() => exec('underline')} title="Underline">
        <Underline className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton active={state.strikethrough} onClick={() => exec('strikeThrough')} title="Strikethrough">
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-0.5" />
      <ToolbarButton active={state.link} onClick={handleLink} title={state.link ? 'Remove link' : 'Add link'}>
        {state.link ? <Unlink className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-0.5" />
      <div className="relative">
        <ToolbarButton active={showColorPicker} onClick={() => setShowColorPicker(!showColorPicker)} title="Text color">
          <Type className="h-3.5 w-3.5" />
        </ToolbarButton>
        {showColorPicker && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 rounded-lg border border-border bg-popover shadow-lg grid grid-cols-3 gap-1.5"
            onMouseDown={(e) => e.preventDefault()}
          >
            {COLORS.map((color) => (
              <button
                key={color}
                className="h-6 w-6 rounded-full border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  exec('foreColor', color);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-popover-foreground hover:bg-secondary'
      }`}
    >
      {children}
    </button>
  );
}

export function InlineEditor({ value, onChange, style, className, tag: Tag = 'div' }: InlineEditorProps) {
  const ref = useRef<HTMLElement>(null);
  const lastValue = useRef(value);
  const [toolbar, setToolbar] = useState<ToolbarState>({
    show: false, x: 0, y: 0,
    bold: false, italic: false, underline: false, strikethrough: false, link: false,
  });

  const syncContent = useCallback(() => {
    const html = ref.current?.innerHTML ?? '';
    if (html !== lastValue.current) {
      lastValue.current = html;
      onChange(html);
    }
  }, [onChange]);

  const handleBlur = useCallback(() => {
    // Small delay so toolbar clicks register before hiding
    setTimeout(() => {
      if (!ref.current?.contains(document.activeElement)) {
        setToolbar(prev => ({ ...prev, show: false }));
        syncContent();
      }
    }, 150);
  }, [syncContent]);

  const updateToolbar = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !ref.current?.contains(selection.anchorNode)) {
      setToolbar(prev => ({ ...prev, show: false }));
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setToolbar({
      show: true,
      x: rect.left + rect.width / 2 - 120,
      y: rect.top - 44,
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      link: (() => {
        let node: Node | null = selection.anchorNode;
        while (node && node !== ref.current) {
          if ((node as HTMLElement).tagName === 'A') return true;
          node = node.parentNode;
        }
        return false;
      })(),
    });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Allow formatting shortcuts
    if ((e.metaKey || e.ctrlKey) && ['b', 'i', 'u'].includes(e.key)) {
      // Let browser handle it
      e.stopPropagation();
      setTimeout(updateToolbar, 0);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    e.stopPropagation();
  }, [updateToolbar]);

  const handleInput = useCallback(() => {
    syncContent();
  }, [syncContent]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateToolbar);
    return () => document.removeEventListener('selectionchange', updateToolbar);
  }, [updateToolbar]);

  // Sync external value changes
  if (ref.current && document.activeElement !== ref.current && value !== lastValue.current) {
    ref.current.innerHTML = value;
    lastValue.current = value;
  }

  return (
    <>
      <FloatingToolbar state={toolbar} containerRef={ref} />
      <Tag
        ref={ref as any}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onMouseUp={() => setTimeout(updateToolbar, 0)}
        onClick={(e) => e.stopPropagation()}
        style={{ ...style, outline: 'none', cursor: 'text', minWidth: '1em' }}
        className={className}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  );
}
