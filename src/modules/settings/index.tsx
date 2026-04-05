import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import { SettingsModal } from './pages/settings-modal/page';
import { WorkspaceSettingsPage } from './pages/workspace/page';
import MembersPage from './pages/members/page';

export default function SettingsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="settings-modal" replace />} />
                <Route path="settings-modal" element={<SettingsModal />} />
                <Route path="workspace" element={<WorkspaceSettingsPage />} />
                <Route path="members" element={<MembersPage />} />
            </Route>
        </Routes>
    );
}
