import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import { SettingsModal } from './pages/settings-modal/page';

export default function SettingsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="settings-modal" replace />} />
                <Route path="settings-modal" element={<SettingsModal />} />
            </Route>
        </Routes>
    );
}
