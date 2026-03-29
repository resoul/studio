import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    Eye, Code, Mail, Undo2, Redo2, Plus, FileUp, Sparkles,
    LayoutTemplate, ChevronDown, Monitor, Smartphone, Sun, Moon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/config/i18n/types';

interface BuilderHeaderProps {
    isEmpty: boolean;
    onPreview: () => void;
    onExport: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onStartScratch: () => void;
    onUploadHtml: () => void;
    onGenerateAI: () => void;
    onOpenTemplates: () => void;
    viewMode: 'desktop' | 'mobile';
    onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}

const LANGUAGE_OPTIONS: { code: Language; flag: string; label: string }[] = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' },
    { code: 'uk', flag: '🇺🇦', label: 'Українська' },
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
];

export function BuilderHeader({
                                  isEmpty,
                                  onPreview,
                                  onExport,
                                  onUndo,
                                  onRedo,
                                  canUndo,
                                  canRedo,
                                  onStartScratch,
                                  onUploadHtml,
                                  onGenerateAI,
                                  onOpenTemplates,
                                  viewMode,
                                  onViewModeChange,
                              }: BuilderHeaderProps) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const handleDesktopView = useCallback(() => onViewModeChange('desktop'), [onViewModeChange]);
    const handleMobileView = useCallback(() => onViewModeChange('mobile'), [onViewModeChange]);
    const handleThemeToggle = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark, setTheme]);
    const { t, language, setLanguage } = useTranslation();

    const currentLang = LANGUAGE_OPTIONS.find(l => l.code === language);

    return (
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
            {/* Left: branding + undo/redo */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                    <Mail className="h-5 w-5 text-primary" />
                    <h1 className="text-base font-semibold text-foreground">Email Builder</h1>
                </div>
                {!isEmpty && (
                    <div className="flex items-center gap-0.5 ml-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUndo} disabled={!canUndo}>
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t('header.undo')} (Ctrl+Z)</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRedo} disabled={!canRedo}>
                                    <Redo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t('header.redo')} (Ctrl+Shift+Z)</TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </div>

            {/* Center: Desktop/Mobile toggle */}
            {!isEmpty ? (
                <div className="flex items-center rounded-lg border border-border bg-secondary p-0.5">
                    <button
                        onClick={handleDesktopView}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            viewMode === 'desktop'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Monitor className="h-3.5 w-3.5" />
                        {t('header.desktopView')}
                    </button>
                    <button
                        onClick={handleMobileView}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            viewMode === 'mobile'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Smartphone className="h-3.5 w-3.5" />
                        {t('header.mobileView')}
                    </button>
                </div>
            ) : (
                <div />
            )}

            {/* Right: actions */}
            <div className="flex items-center gap-2">
                {/* Language selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 px-2 font-medium text-muted-foreground hover:text-foreground"
                        >
                            <span className="text-base leading-none">{currentLang?.flag}</span>
                            <span className="text-xs uppercase">{language}</span>
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        {LANGUAGE_OPTIONS.map(({ code, flag, label }) => (
                            <DropdownMenuItem
                                key={code}
                                onClick={() => setLanguage(code)}
                                className={`gap-2 ${language === code ? 'bg-accent' : ''}`}
                            >
                                <span className="text-base">{flag}</span>
                                <span>{label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Dark / Light toggle */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleThemeToggle}
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isDark ? 'Switch to Light' : 'Switch to Dark'}</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <LayoutTemplate className="h-4 w-4 mr-1.5" />
                            New
                            <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={onStartScratch}>
                            <Plus className="h-4 w-4 mr-2" />
                            Start from Scratch
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onUploadHtml}>
                            <FileUp className="h-4 w-4 mr-2" />
                            Upload HTML
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onGenerateAI}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate with AI
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onOpenTemplates}>
                            <LayoutTemplate className="h-4 w-4 mr-2" />
                            Templates
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {!isEmpty && (
                    <>
                        <Button variant="outline" size="sm" onClick={onPreview}>
                            <Eye className="h-4 w-4 mr-1.5" />
                            {t('header.preview')}
                        </Button>
                        <Button size="sm" onClick={onExport} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Code className="h-4 w-4 mr-1.5" />
                            {t('header.export')}
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
