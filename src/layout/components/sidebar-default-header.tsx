import {
  Building2,
  Check,
  ChevronDown,
  Crown,
  LogOut,
  Moon,
  PanelRightOpen,
  Plus,
  Settings,
  Sun,
  Globe,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { useLayout } from './layout-context';
import { useCallback } from 'react';
import { Language } from '@/config/i18n/types';
import { useTranslation } from '@/hooks/useTranslation';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useWorkspaces } from '@/hooks/use-workspaces';

const getWorkspaceColor = (id: string) => {
  const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-pink-500', 'bg-amber-500', 'bg-blue-500'];
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

interface SidebarDefaultHeaderProps {
    onSwitchToWorkspace?: () => void;
}

const LANGUAGE_OPTIONS: { code: Language; flag: string; label: string }[] = [
    { code: 'en', flag: toAbsoluteUrl('/media/flags/united-states.svg'), label: 'English' },
    { code: 'ru', flag: toAbsoluteUrl('/media/flags/russia.svg'), label: 'Русский' },
    { code: 'uk', flag: toAbsoluteUrl('/media/flags/ukraine.svg'), label: 'Українська' },
    { code: 'it', flag: toAbsoluteUrl('/media/flags/italy.svg'), label: 'Italiano' },
    { code: 'es', flag: toAbsoluteUrl('/media/flags/spain.svg'), label: 'Español' },
    { code: 'fr', flag: toAbsoluteUrl('/media/flags/france.svg'), label: 'Français' },
];

export function SidebarDefaultHeader({ onSwitchToWorkspace }: SidebarDefaultHeaderProps) {
  const { sidebarCollapse, setSidebarCollapse } = useLayout();
  const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleSettings   = useCallback(() => navigate('/settings/'), [navigate]);
    const handleSignOut = useCallback(() => {
        logout();
    }, [logout]);
    const { t, language, setLanguage } = useTranslation();
    const currentLang = LANGUAGE_OPTIONS.find(l => l.code === language);
    const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces();

  return (
    <div className="group flex justify-between items-center gap-2.5 border-b border-border h-11 lg:h-(--sidebar-header-height) shrink-0 px-2.5">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between gap-2.5 px-1.5 hover:bg-accent -ms-0.5"
            >
              <span className={cn("rounded-md text-white text-sm shrink-0 size-6 flex items-center justify-center", currentWorkspace ? getWorkspaceColor(currentWorkspace.id) : "bg-emerald-500")}>
                {currentWorkspace?.name[0] || 'S'}
              </span>
              <span className="text-foreground text-sm font-medium in-data-[sidebar-collapsed]:hidden truncate max-w-[100px]">
                {currentWorkspace?.name || 'Studio'}
              </span>
              <ChevronDown className="size-4 text-muted-foreground in-data-[sidebar-collapsed]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64"
            side="bottom"
            align="start"
            sideOffset={7}
            alignOffset={0}
          >
            {/* Account Section */}
            <DropdownMenuLabel>{t('sidebar.my.account')}</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="size-4" />
                <span>{t('layout.sidebar.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="size-4" />
                <span>{t('layout.sidebar.settings')}</span>
              </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-2 [&_[data-slot=dropdown-menu-sub-trigger-indicator]]:hidden hover:[&_[data-slot=badge]]:border-input data-[state=open]:[&_[data-slot=badge]]:border-input">
                        <Globe />
                        <span className="flex items-center justify-between gap-2 grow relative">
                          {t('layout.sidebar.language')}
                          <Badge
                              variant="outline"
                              className="absolute end-0 top-1/2 -translate-y-1/2"
                          >
                            {currentLang?.label}
                              <img
                                  src={currentLang?.flag}
                                  className="w-3.5 h-3.5 rounded-full"
                                  alt={currentLang?.label}
                              />
                          </Badge>
                        </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                        <DropdownMenuRadioGroup
                            value={currentLang?.code}
                            onValueChange={(value) => {
                                const selectedLang = LANGUAGE_OPTIONS.find(
                                    (lang) => lang.code === value,
                                );
                                if (selectedLang) setLanguage(selectedLang.code);
                            }}
                        >
                            {LANGUAGE_OPTIONS.map((item) => (
                                <DropdownMenuRadioItem
                                    key={item.code}
                                    value={item.code}
                                    className="flex items-center gap-2"
                                >
                                    <img
                                        src={item.flag}
                                        className="w-4 h-4 rounded-full"
                                        alt={item.label}
                                    />
                                    <span>{item.label}</span>
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
              <DropdownMenuItem>
                <Crown className="size-4" />
                <span>{t('layout.sidebar.upgrade')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSignOut}>
                <LogOut className="size-4" />
                <span>{t('layout.sidebar.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Workspaces Section */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('layout.sidebar.workspaces')}</DropdownMenuLabel>
            <DropdownMenuGroup>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="flex items-center justify-between"
                  onClick={() => switchWorkspace(workspace.id)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-md text-white text-xs uppercase shrink-0 size-5 flex items-center justify-center',
                        getWorkspaceColor(workspace.id),
                      )}
                    >
                      {workspace.name[0]}
                    </span>
                    <span className="truncate">{workspace.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentWorkspace?.id === workspace.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/workspaces/new')}>
                <Plus className="size-4" />
                <span>{t('layout.sidebar.newWorkspace')}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem onClick={onSwitchToWorkspace}>
              <Building2 className="size-4" />
              <span>{t('layout.sidebar.workspaceSettings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span>
                {theme === 'dark'
                  ? t('layout.sidebar.theme.light')
                  : t('layout.sidebar.theme.dark')}{' '}
                {t('layout.sidebar.mode')}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        variant="ghost"
        mode="icon"
        className="hidden lg:group-hover:flex lg:in-data-[sidebar-collapsed]:hidden!"
        onClick={() => setSidebarCollapse(!sidebarCollapse)}
      >
        <PanelRightOpen className="size-4" />
      </Button>
    </div>
  );
}
