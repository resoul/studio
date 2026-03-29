import { TimerBlock } from '@/types/email-builder';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function computeTimeLeft(deadline: string): TimeLeft {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)     / 1_000),
    };
}

function pad(n: number): string {
    return String(n).padStart(2, '0');
}

function digitCell(value: number, label: string, block: TimerBlock, fontFamily: string): string {
    return `<td style="text-align:center;padding:0 6px;">
  <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
    <tr>
      <td style="background:${block.digitBgColor};color:${block.digitColor};font-family:${fontFamily};font-size:32px;font-weight:700;line-height:1;padding:10px 14px;border-radius:8px;text-align:center;">
        ${pad(value)}
      </td>
    </tr>
    <tr>
      <td style="color:${block.labelColor};font-family:${fontFamily};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;padding-top:5px;text-align:center;">
        ${label}
      </td>
    </tr>
  </table>
</td>`;
}

function separatorCell(block: TimerBlock): string {
    return `<td style="color:${block.separatorColor};font-size:28px;font-weight:700;line-height:1;padding:0 2px;vertical-align:middle;padding-bottom:18px;">:</td>`;
}

export function exportTimerHtml(block: TimerBlock, fontFamily: string): string {
    const { days, hours, minutes, seconds } = computeTimeLeft(block.deadline);
    const alignAttr = block.align === 'center' ? 'center' : block.align === 'right' ? 'right' : 'left';

    const units: Array<{ show: boolean; value: number; label: string }> = [
        { show: block.showDays,    value: days,    label: block.labels.days    },
        { show: block.showHours,   value: hours,   label: block.labels.hours   },
        { show: block.showMinutes, value: minutes, label: block.labels.minutes },
        { show: block.showSeconds, value: seconds, label: block.labels.seconds },
    ].filter((u) => u.show);

    const cells = units
        .map((u, i) => {
            const cell = digitCell(u.value, u.label, block, fontFamily);
            const sep  = i < units.length - 1 ? separatorCell(block) : '';
            return cell + sep;
        })
        .join('\n');

    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:${block.bgColor};border-radius:8px;">
  <tr>
    <td style="text-align:${alignAttr};padding:16px 12px;">
      <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
        <tr>
          ${cells}
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}