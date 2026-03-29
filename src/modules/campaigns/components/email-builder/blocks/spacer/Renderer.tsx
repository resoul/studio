import { SpacerBlock } from '@/types/email-builder';

export function SpacerRenderer({ block }: { block: SpacerBlock }) {
    return <div style={{ height: block.height }} />;
}