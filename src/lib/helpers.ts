export function toAbsoluteUrl(pathname: string): string {
    const baseUrl = import.meta.env.BASE_URL;

    if (baseUrl && baseUrl !== '/') {
        return import.meta.env.BASE_URL + pathname;
    } else {
        return pathname;
    }
}