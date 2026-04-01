import { Separator } from '@/components/ui/separator';
import { ChatSheet } from './chat-sheet';
import { NotificationsSheet } from './notifications-sheet';
import { Bell, LayoutGrid, MessageCircleMore, CircleHelp, CirclePlus, Award, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppsDropdownMenu } from './apps-dropdown-menu';
import { useHeaderSlot } from './header-slot-context';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/hooks/useTranslation';
import { SidebarDefault } from './sidebar-default';
import { SidebarWorkspace } from './sidebar-workspace';
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
    const { pathname } = useLocation();
    const isMobile = useIsMobile();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { headerSlot } = useHeaderSlot();
    const { t } = useTranslation();
    const [isWorkspaceMode, setIsWorkspaceMode] = useState(false);

    useEffect(() => {
        setIsSheetOpen(false);
    }, [pathname]);
  return (
    <header className="fixed top-0 start-0 end-0 z-[10] flex items-center justify-between h-[var(--header-height)] bg-zinc-950 border-b border-zinc-950 dark:border-border transition-[start] duration-200 ease-in-out pe-[var(--removed-body-scroll-bar-size,0px)]">
        {headerSlot ? headerSlot : (
            <>
                <div className="container-fluid flex justify-between items-stretch lg:gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center -ms-1">
                            <img
                                src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                                alt=""
                                className="h-4"
                            />
                            {isMobile && (
                                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="dim" mode="icon" className="hover:text-white">
                                            <Menu />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        className="p-0 gap-0 w-(--sidebar-width)"
                                        side="left"
                                        close={false}
                                    >
                                        <SheetHeader className="p-0 space-y-0" />
                                        <SheetBody className="flex flex-col grow p-0 [--sidebar-space-x:calc(var(--spacing)*2.5)]">
                                            {isWorkspaceMode ? (
                                                <SidebarWorkspace onSwitchToDefault={() => setIsWorkspaceMode(false)} />
                                            ) : (
                                                <SidebarDefault onSwitchToWorkspace={() => setIsWorkspaceMode(true)} />
                                            )}
                                        </SheetBody>
                                    </SheetContent>
                                </Sheet>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2"></div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-gradient-to-r from-blue-800 to-blue-600 text-white hover:from-blue-600 hover:text-white"
                        >
                            <Award className="size-4 text-white" />
                            {t('layout.header.upgrade')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                        >
                            <CirclePlus className="size-4 text-white" />
                            {t('layout.header.new')}
                        </Button>
                        <Separator orientation="vertical" className="bg-zinc-600 h-4 mx-1" />
                        <Button
                            variant="ghost"
                            size="sm"
                            mode="icon"
                            className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                        >
                            <CircleHelp className="size-4 text-white" />
                        </Button>
                        <Separator orientation="vertical" className="bg-zinc-600 h-4 mx-1" />
                        <NotificationsSheet
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                                >
                                    <Bell className="size-4 text-white" />
                                </Button>
                            }
                        />
                        <ChatSheet
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                                >
                                    <MessageCircleMore className="size-4 text-white" />
                                </Button>
                            }
                        />
                        <AppsDropdownMenu
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                                >
                                    <LayoutGrid className="size-4 text-white" />
                                </Button>
                            }
                        />
                        <Separator orientation="vertical" className="bg-zinc-600 h-4 mx-1" />
                        <div className="flex -space-x-2.5">
                            <Avatar className="size-7">
                                <AvatarImage
                                    src={toAbsoluteUrl('/media/avatars/300-1.png')}
                                    alt="user"
                                    className="border-2 border-zinc-950 hover:z-10"
                                />
                                <AvatarFallback>CH</AvatarFallback>
                            </Avatar>
                            <Avatar className="size-7">
                                <AvatarImage
                                    src={toAbsoluteUrl('/media/avatars/300-3.png')}
                                    alt="user"
                                    className="border-2 border-zinc-950 hover:z-10"
                                />
                                <AvatarFallback>CH</AvatarFallback>
                            </Avatar>
                            <Avatar className="size-7">
                                <AvatarImage
                                    src={toAbsoluteUrl('/media/avatars/300-4.png')}
                                    alt="user"
                                    className="border-2 border-zinc-950 hover:z-10"
                                />
                                <AvatarFallback>CH</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </>
        )}
    </header>
  );
}
