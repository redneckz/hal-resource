// @flow
import { cleanupTemplatedHref } from './cleanup-templated-href';

describe('cleanupTemplatedHref', () => {
    it('should cleanup HAL interpolation syntax from URL leaving pure URL without params', () => {
        expect(cleanupTemplatedHref('https://clientRiskAnswers{?foo}{?bar}{?baz}')).toEqual(
            'https://clientRiskAnswers',
        );
    });

    it('should return empty string if empty value provided', () => {
        expect(cleanupTemplatedHref()).toEqual('');
        expect(cleanupTemplatedHref(null)).toEqual('');
        expect(cleanupTemplatedHref('')).toEqual('');
    });
});
