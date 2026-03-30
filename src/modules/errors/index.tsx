import { Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import NotFoundPage from './pages/404/page';

export default function ErrorModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}