// @flow
import { toQuery } from './utils';
import { cleanupTemplatedHref } from './cleanup-templated-href';

export function computeHALRequestURL(endpointHref: string) {
    const endpointURI = cleanupTemplatedHref(endpointHref);
    return function computeURL(
        idOrQuery?: string | { [string]: mixed },
        query?: { [string]: mixed },
    ): string {
        if (idOrQuery && typeof idOrQuery === 'object') {
            // query is passed in place of id
            return computeURL(undefined, idOrQuery);
        }
        const id = idOrQuery;
        if (!id) {
            // endpointURI is the final URL
            return `${endpointURI}?${toQuery(query)}`;
        }
        if (isURL(id)) {
            return `${id}?${toQuery(query)}`;
        }
        return `${endpointURI}/${id}?${toQuery(query)}`;
    };
}

function isURL(str: string | void | null): boolean {
    return (str || '').indexOf('://') !== -1;
}
