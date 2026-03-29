import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AlignSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <Label className="text-xs text-muted-foreground">Alignment</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export function ColorInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="flex gap-2 mt-1">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-9 w-9 rounded border border-border cursor-pointer"
                />
                <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 font-mono text-xs" />
            </div>
        </div>
    );
}
