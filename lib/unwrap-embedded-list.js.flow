// @flow
import type { HALResponse } from './hal-resource-types';

export function unwrapEmbeddedList(obj?: HALResponse | void | null): HALResponse[] {
    if (!obj || !obj._embedded) {
        return [];
    }
    const embed = obj._embedded;
    const [onlyKey] = Object.keys(embed);
    return Array.isArray(embed[onlyKey]) ? embed[onlyKey] : [];
}
