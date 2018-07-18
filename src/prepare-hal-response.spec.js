// @flow
import { prepareHALResponse } from './prepare-hal-response';
import type { HALEndpointFactory } from './hal-resource-types';

describe('prepareHALResponse (transforms HAL response to simplified HAL entity)', () => {
    let endpointFactory: HALEndpointFactory;

    beforeEach(() => {
        endpointFactory = jest.fn((href => href: any));
    });

    it('should compute full id filling it with resource URL', () => {
        const entity = prepareHALResponse(endpointFactory)({
            _links: {
                self: { href: 'http://foo/bar/123{?projection}' },
            },
        });
        expect(entity).toEqual({ id: 'http://foo/bar/123' });
    });

    it('should compute short id (as hidden field)', () => {
        const entity = prepareHALResponse(endpointFactory)({
            _links: {
                self: { href: 'http://foo/bar/123{?projection}' },
            },
        });
        expect(entity).toEqual({ id: 'http://foo/bar/123' });
        expect(entity._id).toBe('123');
    });

    it('should pass scalar fields as is', () => {
        const entity = prepareHALResponse(endpointFactory)({
            foo: 123,
            bar: true,
            baz: '456',
        });
        expect(entity).toEqual({
            id: '',
            foo: 123,
            bar: true,
            baz: '456',
        });
    });

    it('should compute linked resources (as hidden field)', () => {
        const entity = prepareHALResponse(endpointFactory)({
            _links: {
                self: { href: '123' },
                quux: {
                    href: 'http://foo/bar/quux{?page}',
                    templated: true,
                },
                plugh: { href: 'http://foo/bar/plugh' },
            },
        });
        expect(endpointFactory).toHaveBeenCalledTimes(2);
        expect(endpointFactory).toHaveBeenCalledWith('http://foo/bar/quux{?page}');
        expect(endpointFactory).toHaveBeenCalledWith('http://foo/bar/plugh');
        expect(entity.quux).toBe('http://foo/bar/quux{?page}');
        expect(entity.plugh).toBe('http://foo/bar/plugh');
        expect(entity).toEqual({ id: '123' });
    });

    it('should recursively transform objects treating them as HAL responses', () => {
        const entity = prepareHALResponse(endpointFactory)({
            foo: {
                _links: { self: { href: '123' } },
                bar: true,
                baz: '456',
            },
        });
        expect(entity).toEqual({
            id: '',
            foo: {
                id: '123',
                bar: true,
                baz: '456',
            },
        });
    });

    it('should recursively transform arrays treating objects inside them as HAL responses', () => {
        const entity = prepareHALResponse(endpointFactory)({
            foo: [
                {
                    _links: { self: { href: '456' } },
                    bar: 456,
                },
                {
                    _links: { self: { href: '789' } },
                    baz: 789,
                },
            ],
        });
        expect(entity).toEqual({
            id: '',
            foo: [{ id: '456', bar: 456 }, { id: '789', baz: 789 }],
        });
    });

    it('should substitute special HAL field "_embedded" just into resulting entity', () => {
        const entity = prepareHALResponse(endpointFactory)({
            _embedded: {
                bar: true,
                baz: '456',
            },
        });
        expect(entity).toEqual({
            id: '',
            bar: true,
            baz: '456',
        });
    });

    it('should recursively substitute "_embedded"', () => {
        const entity = prepareHALResponse(endpointFactory)({
            _embedded: {
                bar: true,
                baz: '456',
                quux: {
                    _embedded: {
                        plugh: 789,
                    },
                },
            },
        });
        expect(entity).toEqual({
            id: '',
            bar: true,
            baz: '456',
            quux: {
                id: '',
                plugh: 789,
            },
        });
    });
});
