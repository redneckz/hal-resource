// @flow
import { toQuery } from './to-query';

describe('toQuery', () => {
    it('should transform object to query string', () => {
        expect(toQuery({ foo: '123', bar: '456' })).toEqual('foo=123&bar=456');
    });

    it('should transform to string and encode each value', () => {
        expect(toQuery({ foo: true })).toEqual('foo=true');
        expect(toQuery({ foo: 123 })).toEqual('foo=123');
        expect(toQuery({ foo: 'русский' })).toEqual(`foo=${encodeURIComponent('русский')}`);
        expect(toQuery({ foo: {} })).toEqual(`foo=${encodeURIComponent(String({}))}`);
    });

    it('should ignore nil values', () => {
        expect(toQuery({ foo: undefined, bar: null, baz: 123 })).toEqual('baz=123');
    });

    it('should return empty string if provided object is empty ', () => {
        expect(toQuery({})).toEqual('');
        expect(toQuery({ foo: undefined, bar: null })).toEqual('');
    });
});
