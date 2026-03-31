import { Separator } from '@/components/ui/separator';
import { HeaderBrand } from './header-brand';
import { HeaderHelp } from './header-help';
import { HeaderNew } from './header-new';
import { HeaderUpgrade } from './header-upgrade';
import { HeaderUsers } from './header-users';
import { ChatSheet } from './chat-sheet';
import { NotificationsSheet } from './notifications-sheet';
import { Bell, LayoutGrid, MessageCircleMore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppsDropdownMenu } from './apps-dropdown-menu';
import { useHeaderSlot } from './header-slot-context';

export function Header() {
    const { headerSlot } = useHeaderSlot();
  return (
    <header className="fixed top-0 start-0 end-0 z-[10] flex items-center justify-between h-[var(--header-height)] bg-zinc-950 border-b border-zinc-950 dark:border-border transition-[start] duration-200 ease-in-out pe-[var(--removed-body-scroll-bar-size,0px)]">
        {headerSlot ? headerSlot : (
            <>
                <div className="container-fluid flex justify-between items-stretch lg:gap-4">
                    <div className="flex items-center gap-4">
                        <HeaderBrand />
                    </div>
                    <div className="flex items-center gap-2"></div>
                    <div className="flex items-center gap-2">
                        <HeaderUpgrade />
                        <HeaderNew />
                        <Separator orientation="vertical" className="bg-zinc-600 h-4 mx-1" />
                        <HeaderHelp />
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
                        <HeaderUsers />
                    </div>
                </div>
            </>
        )}
    </header>
  );
}
