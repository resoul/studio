interface ViewportSize {
    width: number;
    height: number;
}

interface FloatingSize {
    width: number;
    height: number;
}

interface Point {
    x: number;
    y: number;
}

const FALLBACK_VIEWPORT: ViewportSize = { width: 1024, height: 768 };

function getViewportSize(): ViewportSize {
    if (typeof window === 'undefined') return FALLBACK_VIEWPORT;
    return { width: window.innerWidth, height: window.innerHeight };
}

export function clampValue(value: number, min: number, max: number): number {
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
}

export function clampFloatingPoint(
    point: Point,
    floatingSize: FloatingSize,
    margin = 8,
    viewport: ViewportSize = getViewportSize(),
): Point {
    const maxX = Math.max(margin, viewport.width - floatingSize.width - margin);
    const maxY = Math.max(margin, viewport.height - floatingSize.height - margin);

    return {
        x: clampValue(point.x, margin, maxX),
        y: clampValue(point.y, margin, maxY),
    };
}
