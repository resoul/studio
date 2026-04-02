import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import CampaignBuilderPage from './pages/builder/page';
import CreateCampaignPage from './pages/create/page';
import CampaignsPage from './pages/campaigns/page';
import CampaignTemplatesPage from './pages/templates/page';

export default function CampaignModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="campaigns" replace />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="templates" element={<CampaignTemplatesPage />} />
                <Route path="templates/:templateId" element={<CampaignBuilderPage />} />
                <Route path="create" element={<CreateCampaignPage />} />
                <Route path=":campaignId/edit" element={<CreateCampaignPage />} />
                <Route path=":campaignId/content" element={<CampaignBuilderPage />} />
            </Route>
        </Routes>
    );
}
