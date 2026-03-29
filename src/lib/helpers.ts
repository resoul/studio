export function toAbsoluteUrl(pathname: string): string {
    const baseUrl = import.meta.env.BASE_URL;

    if (baseUrl && baseUrl !== '/') {
        return import.meta.env.BASE_URL + pathname;
    } else {
        return pathname;
    }
}

export function getInitials(
    name: string | null | undefined,
    count?: number,
): string {
    if (!name) {
        return '';
    }

    const initials = name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0].toUpperCase());

    return count && count > 0
        ? initials.slice(0, count).join('')
        : initials.join('');
}