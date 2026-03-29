import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import TrackingPage from './pages/tracking/page';

export default function TagsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="tracking" replace />} />
                <Route path="tracking" element={<TrackingPage />} />
            </Route>
        </Routes>
    );
}
