import { useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
    LayoutDashboard, Send, Users, BarChart2, Settings,
    ChevronLeft, ChevronRight, Mail, FileText, Zap,
    Bell, Sun, Moon, ChevronDown, Database, Radio,
    FormInput,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/config/i18n/types';

const LANGUAGE_OPTIONS = [
    { code: 'en' as const, flag: '🇬🇧', label: 'English' },
    { code: 'ru' as const, flag: '🇷🇺', label: 'Русский' },
    { code: 'uk' as const, flag: '🇺🇦', label: 'Українська' },
    { code: 'it' as const, flag: '🇮🇹', label: 'Italiano' },
    { code: 'es' as const, flag: '🇪🇸', label: 'Español' },
    { code: 'fr' as const, flag: '🇫🇷', label: 'Français' },
];

interface NavItem { label: string; to: string; icon: React.ElementType }
interface NavSection { title: string; items: NavItem[] }

const NAV_SECTIONS: NavSection[] = [
    { title: 'Overview', items: [
            { label: 'Dashboard', to: '/', icon: LayoutDashboard },
        ]},
    { title: 'Campaigns', items: [
            { label: 'All campaigns', to: '/campaigns', icon: Send },
            { label: 'Templates',     to: '/templates',  icon: FileText },
            { label: 'Automations',   to: '/automations', icon: Zap },
            { label: 'Forms',         to: '/forms',       icon: FormInput },
        ]},
    { title: 'Contacts', items: [
            { label: 'Lists',         to: '/lists',   icon: Users },
            { label: 'Field Manager', to: '/fields',  icon: Database },
        ]},
    { title: 'Reports', items: [
            { label: 'Analytics', to: '/analytics', icon: BarChart2 },
        ]},
    { title: 'Tracking', items: [
            { label: 'Site & Events', to: '/tracking', icon: Radio },
        ]},
];

interface AppLayoutProps { children: React.ReactNode }

export function AppLayout({ children }: AppLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useTranslation();

    const isDark = theme === 'dark';
    const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language);

    const handleToggleSidebar = useCallback(() => setCollapsed((v) => !v), []);
    const handleToggleTheme   = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark, setTheme]);

    return (
        <div className="flex h-screen overflow-hidden bg-canvas">
            <aside className={cn('relative flex shrink-0 flex-col border-r border-border bg-card transition-all duration-200', collapsed ? 'w-14' : 'w-56')}>
                <div className={cn('flex h-14 items-center border-b border-border px-4', collapsed ? 'justify-center' : 'gap-2.5')}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
                        <Mail className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {!collapsed && <span className="text-sm font-semibold text-foreground">MailFlow</span>}
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title} className="mb-4">
                            {!collapsed && (
                                <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    {section.title}
                                </p>
                            )}
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
                                const link = (
                                    <NavLink
                                        to={item.to}
                                        className={cn(
                                            'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors mx-2',
                                            collapsed && 'justify-center px-0 mx-2',
                                            isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                                    </NavLink>
                                );
                                return collapsed ? (
                                    <Tooltip key={item.to}>
                                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                                        <TooltipContent side="right">{item.label}</TooltipContent>
                                    </Tooltip>
                                ) : <div key={item.to}>{link}</div>;
                            })}
                        </div>
                    ))}
                </nav>

                <div className="border-t border-border p-2">
                    {collapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to="/settings" className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                                    <Settings className="h-4 w-4" />
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">Settings</TooltipContent>
                        </Tooltip>
                    ) : (
                        <NavLink to="/settings" className={cn('flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors', location.pathname === '/settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                            <Settings className="h-4 w-4 shrink-0" />
                            <span>Settings</span>
                        </NavLink>
                    )}
                </div>

                <button onClick={handleToggleSidebar} className="absolute -right-3 top-[68px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-secondary">
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
                    <div id="page-title-slot" />
                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground">
                                    <span className="text-base leading-none">{currentLang?.flag}</span>
                                    <span className="text-xs uppercase">{language}</span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                {LANGUAGE_OPTIONS.map(({ code, flag, label }) => (
                                    <DropdownMenuItem key={code} onClick={() => setLanguage(code)} className={language === code ? 'bg-accent' : ''}>
                                        <span className="text-base mr-2">{flag}</span>
                                        <span>{label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleTheme}>
                                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isDark ? 'Switch to light' : 'Switch to dark'}</TooltipContent>
                        </Tooltip>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Bell className="h-4 w-4" /></Button>
                        <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">JD</div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}