// @flow
import type { HALResponse, HALEntity, HALEndpointFactory } from './hal-resource-types';
import { cleanupTemplatedHref } from './cleanup-templated-href';
import { retrieveShortIdFromHref } from './retrieve-short-id-from-href';

export function prepareHALResponse(endpointFactory: HALEndpointFactory): HALResponse => HALEntity {
    const mapResponse = (response = {}) => {
        const {
            id, _embedded, _links, ...fields
        } = response;
        const { self: { href: selfHref } = {} } = _links || {};
        const entityBase: HALEntity = {
            get id() {
                return cleanupTemplatedHref(selfHref);
            },
        };
        const entityDescriptors: PropertyDescriptorMap = Object.assign(
            {
                _id: { value: retrieveShortIdFromHref(selfHref) },
                _links: { value: _links },
            },
            ...computeFields(fields),
            ...computeEmbedded(_embedded),
            ...computeLinkedResources(_links),
        );
        return Object.defineProperties(entityBase, entityDescriptors);
    };
    return mapResponse;

    function computeEmbedded(embedded): PropertyDescriptorMap[] {
        const {
            id, _links, _embedded, ...embeddedFields
        } = embedded || {};
        return Object.keys(embeddedFields).map(key => ({
            [key]: {
                value: computeFieldValue(embeddedFields[key] || ''),
                enumerable: true,
            },
        }));
    }

    function computeLinkedResources({ self, ...links } = {}): PropertyDescriptorMap[] {
        return links
            ? Object.keys(links).map(key => ({
                [key]: {
                    value: endpointFactory(links[key].href),
                },
            }))
            : [];
    }

    function computeFields(fields): PropertyDescriptorMap[] {
        return Object.keys(fields).map(key => ({
            [key]: {
                value: computeFieldValue(fields[key]),
                enumerable: true,
            },
        }));
    }

    function computeFieldValue(val: HALResponse | HALResponse[] | string | number | boolean) {
        if (Array.isArray(val)) {
            return val.map(computeFieldValue);
        }
        if (val && typeof val === 'object') {
            return mapResponse(val);
        }
        return val;
    }
}
