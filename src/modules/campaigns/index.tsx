import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import CampaignBuilderPage from './pages/builder/page';
import CreateCampaignPage from './pages/create/page';

export default function CampaignModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="create" replace />} />
                <Route path="create" element={<CreateCampaignPage />} />
                <Route path=":campaignId/content" element={<CampaignBuilderPage />} />
            </Route>
        </Routes>
    );
}
