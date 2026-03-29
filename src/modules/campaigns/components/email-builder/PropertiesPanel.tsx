import { useCallback } from 'react';
import {
    EmailBlock, EmailTemplate,
    HeadingBlock, TextBlock, ImageBlock, ButtonBlock,
    DividerBlock, SpacerBlock, HtmlBlock, SocialBlock,
    ConditionalBlock, HeroBlock, ProductCardBlock, CouponBlock, SurveyBlock,
} from '@/types/email-builder';
import {
    HeadingProps, TextProps, ImageProps, ButtonProps,
    DividerProps, SpacerProps, HtmlProps,
    HeroProps, ProductCardProps, CouponProps,
} from './properties-panel/basic-block-panels';
import { SocialProps }      from './properties-panel/social-props';
import { ConditionalProps } from './properties-panel/conditional-props';
import { TemplateSettings } from './properties-panel/template-settings';
import { BLOCK_LABELS }     from './properties-panel/constants';
import { SurveyProps }      from './blocks/survey';
import { TimerProps }  from './blocks/timer';
import { VideoProps }  from './blocks/video';
import { TimerBlock, VideoBlock } from '@/types/email-builder';

interface PropertiesPanelProps {
    block: EmailBlock | null;
    onUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
    template: EmailTemplate;
    onUpdateTemplate: (updates: Partial<EmailTemplate>) => void;
}

function BlockProperties({
                             block,
                             onUpdate,
                         }: {
    block: EmailBlock;
    onUpdate: (updates: Partial<EmailBlock>) => void;
}) {
    if (block.type === 'heading')      return <HeadingProps      block={block as HeadingBlock}      onUpdate={onUpdate as (u: Partial<HeadingBlock>) => void}      />;
    if (block.type === 'text')         return <TextProps          block={block as TextBlock}          onUpdate={onUpdate as (u: Partial<TextBlock>) => void}          />;
    if (block.type === 'image')        return <ImageProps         block={block as ImageBlock}         onUpdate={onUpdate as (u: Partial<ImageBlock>) => void}         />;
    if (block.type === 'button')       return <ButtonProps        block={block as ButtonBlock}        onUpdate={onUpdate as (u: Partial<ButtonBlock>) => void}        />;
    if (block.type === 'hero')         return <HeroProps          block={block as HeroBlock}          onUpdate={onUpdate as (u: Partial<HeroBlock>) => void}          />;
    if (block.type === 'product-card') return <ProductCardProps   block={block as ProductCardBlock}   onUpdate={onUpdate as (u: Partial<ProductCardBlock>) => void}   />;
    if (block.type === 'coupon')       return <CouponProps        block={block as CouponBlock}        onUpdate={onUpdate as (u: Partial<CouponBlock>) => void}        />;
    if (block.type === 'divider')      return <DividerProps       block={block as DividerBlock}       onUpdate={onUpdate as (u: Partial<DividerBlock>) => void}       />;
    if (block.type === 'spacer')       return <SpacerProps        block={block as SpacerBlock}        onUpdate={onUpdate as (u: Partial<SpacerBlock>) => void}        />;
    if (block.type === 'html')         return <HtmlProps          block={block as HtmlBlock}          onUpdate={onUpdate as (u: Partial<HtmlBlock>) => void}          />;
    if (block.type === 'social')       return <SocialProps        block={block as SocialBlock}        onUpdate={onUpdate as (u: Partial<SocialBlock>) => void}        />;
    if (block.type === 'conditional')  return <ConditionalProps   block={block as ConditionalBlock}   onUpdate={onUpdate as (u: Partial<ConditionalBlock>) => void}   />;
    if (block.type === 'survey')       return <SurveyProps        block={block as SurveyBlock}        onUpdate={onUpdate as (u: Partial<SurveyBlock>) => void}        />;
    if (block.type === 'timer')        return <TimerProps block={block as TimerBlock} onUpdate={onUpdate as (u: Partial<TimerBlock>) => void} />;
    if (block.type === 'video')        return <VideoProps block={block as VideoBlock} onUpdate={onUpdate as (u: Partial<VideoBlock>) => void} />;
    return null;
}

export function PropertiesPanel({ block, onUpdate, template, onUpdateTemplate }: PropertiesPanelProps) {
    const handleUpdate = useCallback(
        (updates: Partial<EmailBlock>) => {
            if (!block) return;
            onUpdate(block.id, updates);
        },
        [block, onUpdate],
    );

    if (!block) {
        return (
            <div className="p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Template Settings
                </h3>
                <TemplateSettings template={template} onUpdate={onUpdateTemplate} />
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {BLOCK_LABELS[block.type] ?? block.type} Properties
            </h3>
            <BlockProperties block={block} onUpdate={handleUpdate} />
        </div>
    );
}
