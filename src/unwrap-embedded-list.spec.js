// @flow
import { unwrapEmbeddedList } from './unwrap-embedded-list';

describe('unwrapEmbeddedList', () => {
    it('should retrieve list wrapped inside HAL special field "_embedded"', () => {
        const riskQuestions = [{ hint: 'Hello' }];
        expect(unwrapEmbeddedList({ _embedded: { riskQuestions } })).toEqual(riskQuestions);
    });

    it('should return empty array if empty value provided', () => {
        expect(unwrapEmbeddedList()).toEqual([]);
        expect(unwrapEmbeddedList({})).toEqual([]);
        expect(unwrapEmbeddedList({ _embedded: {} })).toEqual([]);
    });
});
