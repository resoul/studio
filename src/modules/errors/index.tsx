import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layout';
import NotFoundPage from './pages/404';

export default function ErrorModule() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}