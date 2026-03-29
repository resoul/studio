import {
    Heading,
    Type,
    ImageIcon,
    MousePointerClick,
    Minus,
    ArrowUpDown,
    Code,
    Share2,
    GitBranch,
    RectangleHorizontal,
    Package,
    TicketPercent,
    Star,
    Timer,
    Video,
} from 'lucide-react';
import { BlockType } from '@/types/email-builder';
import { ElementType } from 'react';

export const BLOCK_META: Record<BlockType, { label: string; icon: ElementType }> = {
    heading:       { label: 'Heading',      icon: Heading },
    text:          { label: 'Text',         icon: Type },
    image:         { label: 'Image',        icon: ImageIcon },
    button:        { label: 'Button',       icon: MousePointerClick },
    hero:          { label: 'Hero',         icon: RectangleHorizontal },
    'product-card':{ label: 'Product Card', icon: Package },
    coupon:        { label: 'Coupon',       icon: TicketPercent },
    divider:       { label: 'Divider',      icon: Minus },
    spacer:        { label: 'Spacer',       icon: ArrowUpDown },
    html:          { label: 'HTML',         icon: Code },
    social:        { label: 'Social',       icon: Share2 },
    conditional:   { label: 'IF / ELSE',    icon: GitBranch },
    survey:        { label: 'Survey',       icon: Star },
    timer:         { label: 'Timer',   icon: Timer },
    video:         { label: 'Video',   icon: Video },
};