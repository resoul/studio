import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import ContactsPage from './pages/contacs/page';

export default function ListsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="contacts" replace />} />
                <Route path="contacts" element={<ContactsPage />} />
            </Route>
        </Routes>
    );
}
