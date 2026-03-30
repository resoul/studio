import { SidebarDefaultContent } from './sidebar-default-content';
import { SidebarDefaultFooter } from './sidebar-default-footer';
import { SidebarDefaultHeader } from './sidebar-default-header';

interface SidebarDefaultProps {
    onSwitchToWorkspace?: () => void;
}

export function SidebarDefault({ onSwitchToWorkspace }: SidebarDefaultProps) {
  return (
    <>
      <SidebarDefaultHeader onSwitchToWorkspace={onSwitchToWorkspace} />
      <SidebarDefaultContent />
      <SidebarDefaultFooter />
    </>
  );
}
