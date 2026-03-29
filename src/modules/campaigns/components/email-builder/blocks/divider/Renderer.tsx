import { DividerBlock } from '@/types/email-builder';

export function DividerRenderer({ block }: { block: DividerBlock }) {
    return (
        <hr
            style={{ borderTop: `${block.thickness}px ${block.style} ${block.color}` }}
            className="my-3 border-0"
        />
    );
}