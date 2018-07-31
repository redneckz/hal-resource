// @flow
import { retrieveShortIdFromHref } from './retrieve-short-id-from-href';

describe('retrieveShortIdFromHref', () => {
    it('should retrieve resource short id from resource URI', () => {
        expect(retrieveShortIdFromHref('http://some/resources/123')).toBe('123');
    });

    it('should return original string if passed invalid URI', () => {
        expect(retrieveShortIdFromHref('123')).toBe('123');
    });

    it('should return empty string if empty value passed', () => {
        expect(retrieveShortIdFromHref('')).toBe('');
        expect(retrieveShortIdFromHref(null)).toBe('');
        expect(retrieveShortIdFromHref(undefined)).toBe('');
    });
});
