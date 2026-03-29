import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import { CompanyPage } from './pages/companies/company/page';
import { CompaniesListPage } from './pages/companies/page';
import ContactsPage from './pages/contacts/page';
import { Dashboard } from './pages/dashboard/page';
import { DealsPage } from './pages/deals/page';
import { NotesPage } from './pages/notes/page';
import { TasksPage } from './pages/tasks/page';

export default function DashboardModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tasks/" element={<TasksPage />} />
                <Route path="notes/" element={<NotesPage />} />
                <Route path="companies/" element={<CompaniesListPage />} />
                <Route path="company/" element={<CompanyPage />} />
                <Route path="companies/:companyId" element={<CompanyPage />} />
                <Route path="contacts/" element={<ContactsPage />} />
                <Route path="contacts/:contactId" element={<CompanyPage />} />
                <Route path="deals/" element={<DealsPage />} />
            </Route>
        </Routes>
    );
}
