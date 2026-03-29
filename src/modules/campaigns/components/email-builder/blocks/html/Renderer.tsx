import { HtmlBlock } from '@/types/email-builder';

export function HtmlRenderer({ block }: { block: HtmlBlock }) {
    return <div className="py-1" dangerouslySetInnerHTML={{ __html: block.content }} />;
}