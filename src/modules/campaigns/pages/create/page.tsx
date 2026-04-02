import { useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { CampaignWizard } from '@/modules/campaigns/components/campaign-wizard';
import type { CampaignFormData, CampaignType } from '@/types/campaign';
import { PageHeader } from './page-header';
import { Content } from '@/layout/components/content';

const VALID_TYPES = new Set<CampaignType>(['regular', 'ab', 'automated', 'rss']);

function toValidType(raw: string | null): CampaignType | undefined {
    if (raw && VALID_TYPES.has(raw as CampaignType)) return raw as CampaignType;
    return undefined;
}

export default function CreateCampaignPage() {
    const [searchParams] = useSearchParams();
    const { campaignId }  = useParams<{ campaignId?: string }>();

    // ?type=rss  → pre-select campaign type in wizard
    const prefillType = toValidType(searchParams.get('type'));

    const isEdit = Boolean(campaignId && campaignId !== 'new');

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
        // navigate('/builder', { state: { campaignId, returnTo: '/campaigns' } })
    }, []);

    const handleSendTest = useCallback((data: CampaignFormData) => {
        console.log('[Send test]', data);
        // open a modal / drawer to enter test email address
    }, []);

    return (
        <>
            <PageHeader isEdit={isEdit} campaignId={campaignId} />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">
                    <CampaignWizard
                        prefillType={prefillType}
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