// @flow
export function toQuery(obj?: { [string]: mixed } | void | null): string {
    if (!obj) {
        return '';
    }
    return Object.keys(obj)
        .filter(key => obj && obj[key] !== undefined && obj[key] !== null)
        .map(key => obj && [key, String(obj[key])].map(encodeURIComponent).join('='))
        .join('&');
}
