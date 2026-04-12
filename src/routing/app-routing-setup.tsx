import { Route, Routes, Navigate } from 'react-router';
import { Layout } from '@/components/layouts';
import { LayoutPage } from '@/pages/layout/page';

export function AppRoutingSetup() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/layout" element={<LayoutPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/layout" replace />} />
        </Routes>
    );
}
