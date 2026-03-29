import { EmailBlock, SocialBlock, ConditionalBlock } from '@/types/email-builder';
import { SOCIAL_NETWORK_MAP } from '@/config/social-networks';
import { DEFAULT_PERSONALIZATION_VARIABLES } from '@/config/personalization';
import { HeadingRenderer } from './blocks/heading';
import { TextRenderer } from './blocks/text';
import { ImageRenderer } from './blocks/image';
import { ButtonRenderer } from './blocks/button';
import { DividerRenderer } from './blocks/divider';
import { SpacerRenderer } from './blocks/spacer';
import { HtmlRenderer } from './blocks/html';
import { HeroRenderer } from './blocks/hero';
import { ProductCardRenderer } from './blocks/product-card';
import { CouponRenderer } from './blocks/coupon';
import { SurveyRenderer } from './blocks/survey';
import { TimerRenderer } from './blocks/timer';
import { VideoRenderer } from './blocks/video';
import { SocialRenderer }       from './blocks/social';
import { ConditionalRenderer }  from './blocks/conditional';

interface BlockRendererProps {
    block: EmailBlock;
    isPreview?: boolean;
    onInlineUpdate?: (blockId: string, updates: Partial<EmailBlock>) => void;
    isSelected?: boolean;
}

export function BlockRenderer({ block, isPreview, onInlineUpdate, isSelected }: BlockRendererProps) {
    switch (block.type) {
        case 'heading':
            return (
                <HeadingRenderer
                    block={block}
                    isSelected={isSelected && !isPreview}
                    onInlineUpdate={onInlineUpdate}
                />
            );

        case 'text':
            return (
                <TextRenderer
                    block={block}
                    isSelected={isSelected && !isPreview}
                    onInlineUpdate={onInlineUpdate}
                />
            );

        case 'image':
            return (
                <ImageRenderer
                    block={block}
                    isSelected={isSelected && !isPreview}
                    onInlineUpdate={onInlineUpdate}
                />
            );

        case 'button':
            return (
                <ButtonRenderer
                    block={block}
                    isSelected={isSelected && !isPreview}
                    onInlineUpdate={onInlineUpdate}
                />
            );

        case 'hero':
            return <HeroRenderer block={block} />;

        case 'product-card':
            return <ProductCardRenderer block={block} />;

        case 'coupon':
            return <CouponRenderer block={block} />;

        case 'divider':
            return <DividerRenderer block={block} />;

        case 'spacer':
            return <SpacerRenderer block={block} />;

        case 'html':
            return <HtmlRenderer block={block} />;

        case 'social':
            return <SocialRenderer block={block} />;

        case 'conditional':
            return (
                <ConditionalRenderer
                    block={block}
                    isPreview={isPreview}
                    onInlineUpdate={onInlineUpdate}
                />
            );

        case 'survey':
            return <SurveyRenderer block={block} />;

        case 'timer':
            return <TimerRenderer block={block} />;

        case 'video':
            return <VideoRenderer block={block} />;
    }
}
