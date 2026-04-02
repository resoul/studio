export type CampaignType = 'regular' | 'ab' | 'automated' | 'rss';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'sent' | 'paused' | 'archived';

export interface CampaignSummary {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    subject: string;
    recipients: number;
    sent: number;
    openRate: number;
    clickRate: number;
    sentAt: string | null;
}

export type ScheduleType = 'now' | 'later';
export interface CampaignFormData {
    name: string;
    type: CampaignType;
    subject: string;
    /** A/B variant B subject — only used when type === 'ab' */
    subjectB: string;
    preheader: string;
    fromName: string;
    fromEmail: string;
    replyTo: string;
    listIds: string[];
    scheduleType: ScheduleType;
    sendDate: string;
    sendTime: string;
    timezone: string;
    templateId: string;
    /** RSS feed URL — only used when type === 'rss' */
    rssFeedUrl: string;
}

export const CAMPAIGN_FORM_DEFAULTS: CampaignFormData = {
    name: '',
    type: 'regular',
    subject: '',
    subjectB: '',
    preheader: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    listIds: [],
    scheduleType: 'now',
    sendDate: '',
    sendTime: '',
    timezone: 'UTC',
    templateId: '',
    rssFeedUrl: '',
};

export type WizardStep = 'metadata' | 'sender' | 'audience' | 'content' | 'schedule' | 'review';

export const WIZARD_STEPS: WizardStep[] = [
    'metadata',
    'sender',
    'audience',
    'content',
    'schedule',
    'review',
];

export const STEP_LABELS: Record<WizardStep, string> = {
    metadata: 'Details',
    sender:   'Sender',
    audience: 'Audience',
    content:  'Content',
    schedule: 'Schedule',
    review:   'Review',
};

export type StepErrors = Partial<Record<string, string>>;

export interface ContactList {
    id: string;
    name: string;
    count: number;
}

export interface SenderOption {
    id: string;
    name: string;
    email: string;
    verified: boolean;
}