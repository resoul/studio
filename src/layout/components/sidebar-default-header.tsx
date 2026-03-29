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
  User,
} from 'lucide-react';
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
} from '@/components/ui/dropdown-menu';
import { useLayout } from './layout-context';

interface Workspace {
  id: string;
  name: string;
  state: string;
  isCurrent: boolean;
}

const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Keenthemes',
    state: 'bg-emerald-500',
    isCurrent: true,
  },
  {
    id: '2',
    name: 'Studio',
    state: 'bg-indigo-500',
    isCurrent: false,
  },
  {
    id: '3',
    name: 'ReUI',
    state: 'bg-pink-500',
    isCurrent: false,
  },
];

export function SidebarDefaultHeader() {
  const { sidebarCollapse, setSidebarCollapse } = useLayout();
  const { theme, setTheme } = useTheme();

  return (
    <div className="group flex justify-between items-center gap-2.5 border-b border-border h-11 lg:h-(--sidebar-header-height) shrink-0 px-2.5">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between gap-2.5 px-1.5 hover:bg-accent -ms-0.5"
            >
              <span className="rounded-md bg-emerald-500 text-white text-sm shrink-0 size-6 flex items-center justify-center">
                K
              </span>
              <span className="text-foreground text-sm font-medium in-data-[sidebar-collapsed]:hidden">
                Keenthemes
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Crown className="size-4" />
                <span>Upgrade</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Workspaces Section */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuGroup>
              {mockWorkspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-md text-white text-xs uppercase shrink-0 size-5 flex items-center justify-center',
                        workspace.state,
                      )}
                    >
                      {workspace.name[0]}
                    </span>
                    <span className="truncate">{workspace.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {workspace.isCurrent && (
                      <Check className="size-4 text-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="size-4" />
                <span>New Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem>
              <Building2 className="size-4" />
              <span>Workspace Settings</span>
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
              <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
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
