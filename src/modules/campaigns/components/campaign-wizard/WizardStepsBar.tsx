import { Check } from 'lucide-react';
import { WizardStep, WIZARD_STEPS, STEP_LABELS, StepErrors } from '@/types/campaign';

interface WizardStepsBarProps {
    currentStep: WizardStep;
    visitedSteps: Set<WizardStep>;
    errors: StepErrors;
    onStepClick: (step: WizardStep) => void;
}

export function WizardStepsBar({
                                   currentStep,
                                   visitedSteps,
                                   errors,
                                   onStepClick,
                               }: WizardStepsBarProps) {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep);

    return (
        <nav className="flex border-b border-border bg-secondary/40">
            {WIZARD_STEPS.map((step, index) => {
                const isActive = step === currentStep;
                const isVisited = visitedSteps.has(step);
                const isPast = index < currentIndex;
                const hasError = isVisited && Object.keys(errors).length > 0 && isPast;
                const isClickable = isVisited || index <= currentIndex;

                return (
                    <button
                        key={step}
                        onClick={() => isClickable && onStepClick(step)}
                        disabled={!isClickable}
                        className={[
                            'relative flex flex-1 flex-col items-center gap-1.5 px-2 py-3 text-xs font-medium transition-colors',
                            'not-last:after:absolute not-last:after:right-0 not-last:after:top-[20%] not-last:after:h-[60%] not-last:after:w-px not-last:after:bg-border',
                            isActive
                                ? 'bg-card text-foreground'
                                : isClickable
                                    ? 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    : 'cursor-not-allowed text-muted-foreground/40',
                        ].join(' ')}
                    >
                        <span
                            className={[
                                'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors',
                                hasError
                                    ? 'bg-destructive/15 text-destructive'
                                    : isPast && !hasError
                                        ? 'bg-accent/20 text-accent'
                                        : isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-border text-muted-foreground',
                            ].join(' ')}
                        >
                            {isPast && !hasError ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <span className="hidden sm:block">{STEP_LABELS[step]}</span>
                    </button>
                );
            })}
        </nav>
    );
}