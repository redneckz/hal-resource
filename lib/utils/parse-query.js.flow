// @flow

type QueryParam = [string, string];

export function parseQuery(query?: string | void | null): QueryParam[] {
    if (!query) {
        return [];
    }
    return query
        .split(/[&?]/)
        .filter(Boolean)
        .map(keyVal => keyVal.split('='))
        .map(([key, val = '']) => [key, decodeURIComponent(val)]);
}

export function getQueryParamsByKey(
    targetKey: string,
): (query?: string | void | null) => QueryParam[] {
    return query => parseQuery(query).filter(([key]) => key === targetKey);
}

export function getQueryValsByKey(targetKey: string): (query?: string | void | null) => string[] {
    return query => getQueryParamsByKey(targetKey)(query).map(([, val]) => val);
}
