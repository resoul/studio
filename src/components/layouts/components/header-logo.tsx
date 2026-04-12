import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronsUpDown, Gem, Hexagon, Layers2, Menu, PanelRight, Zap } from 'lucide-react';
import { useLayout } from './context';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SidebarPrimary } from './sidebar-primary';
import { SidebarSecondary } from './sidebar-secondary';
import { toAbsoluteUrl } from '@/lib/helpers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Team {
  icon: React.ElementType;
  name: string;
  color: string;
  members: number;
}

export function HeaderLogo() {
  const { pathname } = useLocation();
  const { isMobile, sidebarToggle } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const teams: Team[] = [
    {
      icon: Zap,
      name: "Thunder AI",
      color: "bg-teal-600 text-white",
      members: 8
    },
    {
      icon: Gem,
      name: "Clarity AI",
      color: "bg-fuchsia-600 text-white",
      members: 6
    },
    {
      icon: Hexagon,
      name: "Lightning AI",
      color: "bg-yellow-600 text-white",
      members: 12
    },
    {
      icon: Layers2,
      name: "Bold AI",
      color: "bg-blue-600 text-white",
      members: 4
    }
  ];

  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="flex border-e border-border items-center gap-2 lg:w-(--sidebar-width)">
      {/* Brand */}
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex items-center justify-center shrink-0 border-e border-border w-(--sidebar-collapsed-width) h-(--header-height) bg-muted">
          <Link to="/layout-14">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo-gray.svg')}
              className="dark:hidden min-h-[30px]"
              alt="Thunder AI Logo"
            />
            <img
              src={toAbsoluteUrl('/media/app/mini-logo-gray-dark.svg')}
              className="hidden dark:block min-h-[30px]"
              alt="Thunder AI Logo"
            />
          </Link>
        </div>

        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" mode="icon" size="sm" className="ms-5.5">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="p-0 gap-0 w-[280px] lg:w-(--sidebar-width)"
              side="left"
              close={false}
            >
              <SheetHeader className="p-0 space-y-0" />
              <SheetBody className="flex grow p-0">
                <SidebarPrimary />
                <SidebarSecondary />
              </SheetBody>
            </SheetContent>
          </Sheet>
        )}

        {/* Sidebar header */}
        <div className="flex w-full grow items-center justify-between px-5 gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex text-muted-foreground hover:text-foreground px-1.5 -ms-1.5"
              >
                <div className={cn("size-6 flex items-center justify-center rounded-md", selectedTeam.color)}>
                  <selectedTeam.icon className="size-4" />
                </div>

                <span className="text-mono text-sm font-medium hidden lg:block">
                  {selectedTeam.name}
                </span>
                <ChevronsUpDown className="opacity-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              side="bottom"
              align="end"
              sideOffset={10}
              alignOffset={-80}
            >
              {teams.map((team) => (
                <DropdownMenuItem key={team.name} onClick={() => setSelectedTeam(team)} data-active={selectedTeam.name === team.name}>
                  <div className={cn("size-6 rounded-md flex items-center justify-center", team.color)}>
                    <team.icon className="size-4" />
                  </div>
                  <span className="text-mono text-sm font-medium">{team.name}</span>
                  {selectedTeam.name === team.name && (
                    <Check className="ms-auto size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sidebar toggle */}
          <Button
            mode="icon"
            variant="ghost"
            onClick={sidebarToggle}
            className="hidden lg:inline-flex text-muted-foreground hover:text-foreground"
          >
            <PanelRight className="-rotate-180 in-data-[sidebar-open=false]:rotate-0 opacity-100" />
          </Button>
        </div>        
      </div>
    </div>
  );
}
