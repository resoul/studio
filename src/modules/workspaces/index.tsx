import { Route, Routes, Navigate } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import WorkspaceInvitePage from './pages/invite/page';
import { CreateWorkspacePage } from './pages/create/page';

export default function WorkspaceRoutes() {
  return (
    <Routes>
      <Route path="/invites/:token" element={<WorkspaceInvitePage />} />
      <Route element={<DefaultLayout />}>
        <Route path="/new" element={<CreateWorkspacePage />} />
      </Route>
      <Route index element={<Navigate to="/" replace />} />
    </Routes>
  );
}
