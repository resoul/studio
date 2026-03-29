import { Fragment, useEffect, useState } from 'react';
import { TimerBlock } from '@/types/email-builder';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function useCountdown(deadline: string): TimeLeft {
    const compute = (): TimeLeft => {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const days = Math.floor(diff / 86_400_000);
        const hours = Math.floor((diff % 86_400_000) / 3_600_000);
        const minutes = Math.floor((diff % 3_600_000) / 60_000);
        const seconds = Math.floor((diff % 60_000) / 1_000);
        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(compute);

    useEffect(() => {
        setTimeLeft(compute());
        const id = setInterval(() => setTimeLeft(compute()), 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deadline]);

    return timeLeft;
}

function DigitBox({
                      value,
                      label,
                      digitBgColor,
                      digitColor,
                      labelColor,
                  }: {
    value: number;
    label: string;
    digitBgColor: string;
    digitColor: string;
    labelColor: string;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
                style={{
                    background: digitBgColor,
                    color: digitColor,
                    borderRadius: 8,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.5px',
                    fontFamily: 'inherit',
                }}
            >
                {String(value).padStart(2, '0')}
            </div>
            <span
                style={{
                    color: labelColor,
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                }}
            >
                {label}
            </span>
        </div>
    );
}

interface TimerRendererProps {
    block: TimerBlock;
}

export function TimerRenderer({ block }: TimerRendererProps) {
    const { days, hours, minutes, seconds } = useCountdown(block.deadline);
    const justifyContent =
        block.align === 'center' ? 'center' : block.align === 'right' ? 'flex-end' : 'flex-start';

    const units = [
        { show: block.showDays,    value: days,    label: block.labels.days    },
        { show: block.showHours,   value: hours,   label: block.labels.hours   },
        { show: block.showMinutes, value: minutes, label: block.labels.minutes },
        { show: block.showSeconds, value: seconds, label: block.labels.seconds },
    ].filter((u) => u.show);

    return (
        <div
            className="py-3 px-2"
            style={{ background: block.bgColor, borderRadius: 8, textAlign: block.align }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent,
                    gap: 8,
                    flexWrap: 'wrap',
                }}
            >
                {units.map((unit, i) => (
                    <Fragment key={unit.label}>
                        <DigitBox
                            value={unit.value}
                            label={unit.label}
                            digitBgColor={block.digitBgColor}
                            digitColor={block.digitColor}
                            labelColor={block.labelColor}
                        />
                        {i < units.length - 1 && (
                            <span
                                style={{
                                    color: block.separatorColor,
                                    fontSize: 24,
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    marginBottom: 18,
                                    alignSelf: 'center',
                                }}
                            >
                                :
                            </span>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}