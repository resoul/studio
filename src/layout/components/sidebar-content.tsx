import { useState } from 'react';
import { SidebarDefault } from './sidebar-default';
import { SidebarWorkspace } from './sidebar-workspace';

export function SidebarContent() {
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(false);

  return (
    <>
      {isWorkspaceMode ? (
        <SidebarWorkspace onSwitchToDefault={() => setIsWorkspaceMode(false)} />
      ) : (
        <SidebarDefault onSwitchToWorkspace={() => setIsWorkspaceMode(true)} />
      )}
    </>
  );
}
