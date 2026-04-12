import { SidebarPrimary } from "./sidebar-primary";
import { SidebarSecondary } from "./sidebar-secondary";

export function Sidebar() {
  return (
    <aside className="fixed overflow-hidden top-(--header-height) start-0 z-20 bottom-0 transition-all duration-300 flex items-stretch flex-shrink-0 w-(--sidebar-width) in-data-[sidebar-open=false]:w-(--sidebar-collapsed-width) border-e border-border">
      <SidebarPrimary />
      <SidebarSecondary />
    </aside>
  );
}
