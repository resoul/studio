import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    CampaignFormData,
    CampaignType,
    CAMPAIGN_FORM_DEFAULTS,
    WizardStep,
    WIZARD_STEPS,
    StepErrors,
} from '@/types/campaign';
import { WizardStepsBar } from './WizardStepsBar';
import { StepMetadata } from './steps/StepMetadata';
import { StepSender } from './steps/StepSender';
import { StepAudience } from './steps/StepAudience';
import { StepContent } from './steps/StepContent';
import { StepSchedule } from './steps/StepSchedule';
import { StepReview } from './steps/StepReview';

interface ValidationResult {
    errors: StepErrors;
    isValid: boolean;
}

function validateStep(step: WizardStep, data: CampaignFormData): ValidationResult {
    const errors: StepErrors = {};

    switch (step) {
        case 'metadata':
            if (!data.name.trim()) errors.name = 'Campaign name is required.';
            break;

        case 'sender':
            if (!data.fromName.trim()) errors.fromName = 'From name is required.';
            if (!data.fromEmail.trim() || !data.fromEmail.includes('@'))
                errors.fromEmail = 'A valid email address is required.';
            break;

        case 'audience':
            if (data.listIds.length === 0)
                errors.listIds = 'Select at least one list.';
            break;

        case 'content':
            if (!data.subject.trim()) errors.subject = 'Subject line is required.';
            if (data.type === 'ab' && !data.subjectB.trim())
                errors.subjectB = 'Variant B subject line is required.';
            if (data.type === 'rss' && !data.rssFeedUrl.trim())
                errors.rssFeedUrl = 'RSS feed URL is required.';
            break;

        case 'schedule':
            if (data.scheduleType === 'later') {
                if (!data.sendDate) errors.sendDate = 'Send date is required.';
                if (!data.sendTime) errors.sendTime = 'Send time is required.';
            }
            break;

        default:
            break;
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}

interface CampaignWizardProps {
    onSave?: (data: CampaignFormData) => void;
    onSend?: (data: CampaignFormData) => void;
    onOpenBuilder?: (data: CampaignFormData) => void;
    onSendTest?: (data: CampaignFormData) => void;
    prefillType?: CampaignType;
    initialData?: Partial<CampaignFormData>;
    className?: string;
}

export function CampaignWizard({
                                   onSave,
                                   onSend,
                                   onOpenBuilder,
                                   onSendTest,
                                   prefillType,
                                   initialData,
                                   className = '',
                               }: CampaignWizardProps) {
    const { toast } = useToast();

    const [data, setData] = useState<CampaignFormData>({
        ...CAMPAIGN_FORM_DEFAULTS,
        // prefillType takes priority over initialData.type, which takes priority over default
        ...(prefillType ? { type: prefillType } : {}),
        ...initialData,
    });
    const [currentStep, setCurrentStep] = useState<WizardStep>('metadata');
    const [visitedSteps, setVisitedSteps] = useState<Set<WizardStep>>(
        new Set(['metadata']),
    );
    const [errors, setErrors] = useState<StepErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    const isLastStep = currentIndex === WIZARD_STEPS.length - 1;

    const handleChange = useCallback((patch: Partial<CampaignFormData>) => {
        setData((prev) => ({ ...prev, ...patch }));
        const patchedKeys = Object.keys(patch);
        setErrors((prev) => {
            const next = { ...prev };
            patchedKeys.forEach((k) => delete next[k]);
            return next;
        });
    }, []);

    const handleGoToStep = useCallback(
        (targetStep: WizardStep) => {
            const targetIndex = WIZARD_STEPS.indexOf(targetStep);
            if (targetIndex > currentIndex) {
                const { errors: validationErrors, isValid } = validateStep(currentStep, data);
                if (!isValid) {
                    setErrors(validationErrors);
                    return;
                }
            }
            setErrors({});
            setCurrentStep(targetStep);
            setVisitedSteps((prev) => new Set([...prev, targetStep]));
        },
        [currentIndex, currentStep, data],
    );

    const handleBack = useCallback(() => {
        if (currentIndex === 0) return;
        setErrors({});
        const prevStep = WIZARD_STEPS[currentIndex - 1];
        setCurrentStep(prevStep);
    }, [currentIndex]);

    const handleSend = useCallback(async () => {
        setIsSending(true);
        try {
            await onSend?.(data);
        } catch {
            toast({ description: 'Failed to send campaign.', variant: 'destructive' });
        } finally {
            setIsSending(false);
        }
    }, [data, onSend, toast]);

    const handleContinue = useCallback(() => {
        if (isLastStep) {
            handleSend();
            return;
        }

        const { errors: validationErrors, isValid } = validateStep(currentStep, data);
        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const nextStep = WIZARD_STEPS[currentIndex + 1];
        setCurrentStep(nextStep);
        setVisitedSteps((prev) => new Set([...prev, nextStep]));
    }, [isLastStep, currentStep, data, currentIndex, handleSend]);

    const handleSaveDraft = useCallback(async () => {
        setIsSaving(true);
        try {
            await onSave?.(data);
            toast({ description: 'Draft saved.' });
        } catch {
            toast({ description: 'Failed to save draft.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    }, [data, onSave, toast]);

    const handleOpenBuilder = useCallback(() => {
        onOpenBuilder?.(data);
    }, [data, onOpenBuilder]);

    const handleSendTest = useCallback(() => {
        onSendTest?.(data);
    }, [data, onSendTest]);

    function renderStep() {
        switch (currentStep) {
            case 'metadata':
                return <StepMetadata data={data} errors={errors} onChange={handleChange} />;
            case 'sender':
                return <StepSender data={data} errors={errors} onChange={handleChange} />;
            case 'audience':
                return <StepAudience data={data} errors={errors} onChange={handleChange} />;
            case 'content':
                return (
                    <StepContent
                        data={data}
                        errors={errors}
                        onChange={handleChange}
                        onOpenBuilder={handleOpenBuilder}
                    />
                );
            case 'schedule':
                return <StepSchedule data={data} errors={errors} onChange={handleChange} />;
            case 'review':
                return (
                    <StepReview
                        data={data}
                        onGoToStep={handleGoToStep}
                        onSendTest={handleSendTest}
                    />
                );
        }
    }

    return (
        <div
            className={[
                'flex flex-col overflow-hidden rounded-lg border border-border bg-card',
                className,
            ].join(' ')}
        >
            <WizardStepsBar
                currentStep={currentStep}
                visitedSteps={visitedSteps}
                errors={errors}
                onStepClick={handleGoToStep}
            />

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                {renderStep()}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-6 py-3 sm:px-8">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className="text-muted-foreground"
                    >
                        Back
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Step {currentIndex + 1} of {WIZARD_STEPS.length}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving…' : 'Save draft'}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleContinue}
                        disabled={isSending}
                        className={
                            isLastStep
                                ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                                : ''
                        }
                    >
                        {isSending
                            ? 'Sending…'
                            : isLastStep
                                ? 'Send campaign'
                                : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}