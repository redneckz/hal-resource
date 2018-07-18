// @flow
export function cleanupTemplatedHref(href: string | void | null): string {
    return href ? href.replace(/{[^}]*}/g, '') : '';
}
