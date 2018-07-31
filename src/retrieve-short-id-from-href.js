// @flow
import { cleanupTemplatedHref } from './cleanup-templated-href';

export function retrieveShortIdFromHref(href: string | void | null): string {
    const cleanHref = cleanupTemplatedHref(href);
    return cleanHref.substr(cleanHref.lastIndexOf('/') + 1);
}
