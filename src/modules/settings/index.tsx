import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import { WorkspaceSettingsPage } from './pages/workspace/page';
import MembersPage from './pages/members/page';

export default function SettingsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="workspace" replace />} />
                <Route path="workspace" element={<WorkspaceSettingsPage />} />
                <Route path="members" element={<MembersPage />} />
            </Route>
        </Routes>
    );
}
