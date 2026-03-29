import { useCallback } from 'react';
import { CampaignWizard } from '@/modules/campaigns/components/campaign-wizard';
import { CampaignFormData } from '@/types/campaign';
import { PageHeader } from './page-header';
import { Content } from '@/layout/components/content';

export default function CreateCampaignPage() {
    const handleSave = useCallback(async (data: CampaignFormData) => {
        console.log('[Draft save]', data);
        // POST /api/campaigns { ...data, status: 'draft' }
    }, []);

    const handleSend = useCallback(async (data: CampaignFormData) => {
        console.log('[Send campaign]', data);
        // POST /api/campaigns { ...data, status: data.scheduleType === 'now' ? 'sending' : 'scheduled' }
    }, []);

    const handleOpenBuilder = useCallback((data: CampaignFormData) => {
        console.log('[Open builder]', data);
        // navigate('/builder', { state: { campaignId, returnTo: '/campaigns/create' } })
    }, []);

    const handleSendTest = useCallback((data: CampaignFormData) => {
        console.log('[Send test]', data);
        // open a modal / drawer to enter test email address
    }, []);

    return (
        <>
            <PageHeader />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">
                    <CampaignWizard
                        onSave={handleSave}
                        onSend={handleSend}
                        onOpenBuilder={handleOpenBuilder}
                        onSendTest={handleSendTest}
                    />
                </Content>
            </div>
        </>
    );
}