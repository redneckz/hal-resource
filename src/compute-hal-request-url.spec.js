// @flow
import { computeHALRequestURL } from './compute-hal-request-url';

describe('computeHALRequestURL', () => {
    it('should compute endpoint full URL regarding base URL and endpoint name', () => {
        expect(computeHALRequestURL('http://some/endpoint')()).toBe('http://some/endpoint?');
    });

    it('should compute endpoint full URL regarding base URL, endpoint name and resource id', () => {
        expect(computeHALRequestURL('http://some/endpoint')('123')).toBe(
            'http://some/endpoint/123?',
        );
    });

    it('should compute endpoint full URL regarding base URL, endpoint name and query', () => {
        expect(computeHALRequestURL('http://some/endpoint')({ page: 1, size: 10 })).toBe(
            'http://some/endpoint?page=1&size=10',
        );
    });

    it('should compute endpoint full URL regarding base URL, endpoint name and query', () => {
        expect(computeHALRequestURL('http://some/endpoint')({ page: 1, size: 10 })).toBe(
            'http://some/endpoint?page=1&size=10',
        );
    });

    it('should compute endpoint full URL regarding base URL, endpoint name, resource id and query', () => {
        expect(computeHALRequestURL('http://some/endpoint')('123', { page: 1, size: 10 })).toBe(
            'http://some/endpoint/123?page=1&size=10',
        );
    });
});
