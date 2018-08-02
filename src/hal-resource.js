// @flow
import type { HALEndpointFactory } from './hal-resource-types';
import { computeHALRequestURL } from './compute-hal-request-url';
import { prepareHALResponse } from './prepare-hal-response';
import { unwrapEmbeddedList } from './unwrap-embedded-list';

export function HALResource(doFetch: typeof fetch): HALEndpointFactory {
    const endpointFactory = (endpointURI) => {
        const fetchJSON = doFetchJSON(doFetch);
        const computeURL = computeHALRequestURL(endpointURI);
        return {
            async getList({ sort: { field: sortField, order } = {}, ...query } = {}) {
                const sort = sortField ? `${sortField},${order.toLowerCase()}` : undefined;
                const response = await fetchJSON(computeURL({ ...query, sort }));
                const list = unwrapEmbeddedList(await response.json());
                return list.map(prepareHALResponse(endpointFactory));
            },
            async getOne(id, query) {
                const response = await fetchJSON(computeURL(id, query));
                return prepareHALResponse(endpointFactory)(await response.json());
            },
            async create(data) {
                const response = await fetchJSON(computeURL(), {
                    method: 'POST',
                    body: JSON.stringify(data || {}),
                });
                return prepareHALResponse(endpointFactory)(await response.json());
            },
            async delete(id) {
                await fetchJSON(computeURL(id), { method: 'DELETE' });
            },
            async update(id, data) {
                const response = await fetchJSON(computeURL(id), {
                    method: 'PATCH',
                    body: JSON.stringify(data || {}),
                });
                return prepareHALResponse(endpointFactory)(await response.json());
            },
            rawGet(id, query) {
                return fetchJSON(computeURL(id, query));
            },
            rawPost(data) {
                return fetchJSON(computeURL(), {
                    method: 'POST',
                    body: JSON.stringify(data || {}),
                });
            },
        };
    };
    return endpointFactory;
}

function doFetchJSON(doFetch: typeof fetch): typeof fetch {
    return (url, options) => {
        const opts = {
            ...options,
            headers: {
                ...(options && options.headers ? options.headers : {}),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        return doFetch(url, opts);
    };
}
