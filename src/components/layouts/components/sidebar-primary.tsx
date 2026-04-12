import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  CheckSquare,
  FolderCode,
  Mails,
  NotepadText,
  ScrollText,
  Settings,
  ShieldUser,
  UserCircle,
  Users,
  User,
  Clock,
  Shield,
  Building2,
  LogOut,
  Download,
  ExternalLink,
  Zap,
  Target,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    icon: UserCircle,
    tooltip: 'Profile',
    path: '#',
    rootPath: '#',
  },
  {
    icon: BarChart3,
    tooltip: 'Dashboard',
    path: '/layout-14',
    rootPath: '/layout-14'
  },
  {
    icon: Settings,
    tooltip: 'Account',
    path: '#',
    rootPath: '#',
  },
  {
    icon: Users,
    tooltip: 'Network',
    path: '#',
    rootPath: '#',
  },
  {
    icon: ShieldUser,
    tooltip: 'Authentication',
    path: '#',
    rootPath: '#',
  },
  {
    icon: FolderCode,
    tooltip: 'Security Logs',
    path: '#',
    rootPath: '#',
  },
  {
    icon: ScrollText,
    tooltip: 'Files',
    path: '#',
    rootPath: '#',
  },
  {
    icon: Bell,
    tooltip: 'Notifications',
    path: '#',
    rootPath: '#',
  },
  {
    icon: CheckSquare,
    tooltip: 'ACL',
    path: '#',
    rootPath: '#',
  },
];

export function SidebarPrimary() {
  const { pathname } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[1]);

  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.rootPath === pathname ||
        (item.rootPath && pathname.includes(item.rootPath))
      ) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);

  return (
    <div className="flex flex-col items-center justify-center shrink-0 px-2.5 py-2.5 gap-5 lg:w-(--sidebar-collapsed-width) border-e border-input bg-muted">
      {/* Navigation */}
      <ScrollArea className="grow w-full h-[calc(100vh-13rem)] lg:h-[calc(100vh-5.5rem)]">
        <div className="grow gap-1 shrink-0 flex items-center flex-col">
          {menuItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  mode="icon"
                  {...(item === selectedMenuItem
                    ? { 'data-state': 'open' }
                    : {})}
                  className={cn(
                    'shrink-0 rounded-md size-9',
                    'data-[state=open]:bg-primary data-[state=open]:text-primary-foreground',
                    'hover:text-foreground',
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className="size-4.5!" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex flex-col items-center gap-2.5 shrink-0">
        <Button variant="ghost" mode="icon" className="text-muted-foreground hover:text-foreground">
          <Mails className="opacity-100"/>
        </Button>

        <Button variant="ghost" mode="icon" className="text-muted-foreground hover:text-foreground">
          <NotepadText className="opacity-100"/>
        </Button>
        
        <Button variant="ghost" mode="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="opacity-100"/>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer mb-2.5">
            <Avatar className="size-7">
              <AvatarImage src={toAbsoluteUrl('/media/avatars/300-2.png')} alt="@reui" />
              <AvatarFallback>CH</AvatarFallback>
              <AvatarIndicator className="-end-2 -top-2">
                <AvatarStatus variant="online" className="size-2.5" />
              </AvatarIndicator>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mb-4" side="right" align="start" sideOffset={11}>
            {/* User Information Section */}
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar>
                <AvatarImage src={toAbsoluteUrl('/media/avatars/300-2.png')} alt="@reui" />
                <AvatarFallback>CH</AvatarFallback>
                <AvatarIndicator className="-end-1.5 -top-1.5">
                  <AvatarStatus variant="online" className="size-2.5" />
                </AvatarIndicator>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-foreground">Chris Harris</span>
                <span className="text-xs text-muted-foreground">Senior Developer</span>
                <Badge variant="success" appearance="outline" size="sm" className="mt-1">Pro Plan</Badge>
              </div>
            </div>
            
            <DropdownMenuItem className="cursor-pointer py-1 rounded-md border border-border hover:bg-muted">
              <Clock/>
              <span>Set availability</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Core Actions */}
            <DropdownMenuItem>
              <Target/>
              <span>My Projects</span>
              <Badge variant="info" size="sm" appearance="outline" className="ms-auto">3</Badge>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Users/>
              <span>Team Management</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Building2/>
              <span>Organization</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuItem>
              <User/>
              <span>Profile Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings/>
              <span>Preferences</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Shield/>
              <span>Security</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Developer Tools */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Zap/>
                <span>Developer Tools</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem>API Documentation</DropdownMenuItem>
                <DropdownMenuItem>Code Repository</DropdownMenuItem>
                <DropdownMenuItem>Testing Suite</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem>
              <Download/>
              <span>Download SDK</span>
              <ExternalLink className="size-3 ms-auto" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Action Items */}
            <DropdownMenuItem>
              <LogOut/>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
