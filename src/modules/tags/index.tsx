import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import ListsPage from './pages/list/page';

export default function TagsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="lists" replace />} />
                <Route path="lists" element={<ListsPage />} />
            </Route>
        </Routes>
    );
}
