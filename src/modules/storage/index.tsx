import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import StorageManagerPage from './pages/storage/page';

export default function StorageModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="storage" replace />} />
                <Route path="storage" element={<StorageManagerPage />} />
            </Route>
        </Routes>
    );
}
