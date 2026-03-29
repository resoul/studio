
export function extractYouTubeId(url: string): string | null {
    const patterns = [
        /youtu\.be\/([^?&#/]+)/,
        /youtube\.com\/watch\?.*v=([^?&#/]+)/,
        /youtube\.com\/embed\/([^?&#/]+)/,
        /youtube\.com\/shorts\/([^?&#/]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function getAutoThumbnail(url: string): string {
    const ytId = extractYouTubeId(url);
    if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    // Vimeo requires an API call — fall back to a placeholder
    return 'https://placehold.co/600x338/0F172A/FFFFFF?text=▶+Video';
}