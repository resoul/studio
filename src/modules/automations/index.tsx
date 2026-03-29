import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import WorkflowBuilderPage from './pages/builder/page';
import AutomationsPage from './pages/automation/page';

export default function AutomationModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="automations" replace />} />
                <Route path="automations" element={<AutomationsPage />} />
                <Route path="automations/:id" element={<WorkflowBuilderPage />} />
            </Route>
        </Routes>
    );
}
