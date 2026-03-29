import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import FormBuilderPage from './pages/form/page';
import FormsPage from './pages/main/page';

export default function FormModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="main" replace />} />
                <Route path="main" element={<FormsPage />} />
                <Route path="form/:formId" element={<FormBuilderPage />} />
            </Route>
        </Routes>
    );
}
