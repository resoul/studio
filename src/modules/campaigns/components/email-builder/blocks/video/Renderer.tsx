import { Play } from 'lucide-react';
import { VideoBlock } from '@/types/email-builder';
import { getAutoThumbnail } from './utils';

interface VideoRendererProps {
    block: VideoBlock;
}

export function VideoRenderer({ block }: VideoRendererProps) {
    const thumbnail = block.thumbnailUrl || getAutoThumbnail(block.url);

    return (
        <div className="py-2" style={{ textAlign: block.align }}>
            <div
                style={{
                    display: 'inline-block',
                    position: 'relative',
                    width: `${block.width}%`,
                    cursor: 'pointer',
                }}
            >
                <img
                    src={thumbnail}
                    alt={block.altText || 'Video thumbnail'}
                    style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
                />
                {block.showPlayButton && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: block.playButtonBgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        }}
                    >
                        <Play
                            style={{
                                fill: block.playButtonColor,
                                stroke: 'none',
                                width: 22,
                                height: 22,
                                marginLeft: 3,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}