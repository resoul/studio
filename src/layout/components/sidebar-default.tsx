import { SidebarDefaultContent } from './sidebar-default-content';
import { SidebarDefaultFooter } from './sidebar-default-footer';
import { SidebarDefaultHeader } from './sidebar-default-header';

export function SidebarDefault() {
  return (
    <>
      <SidebarDefaultHeader />
      <SidebarDefaultContent />
      <SidebarDefaultFooter />
    </>
  );
}
