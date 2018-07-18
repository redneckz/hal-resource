// @flow
import { parseQuery, getQueryParamsByKey, getQueryValsByKey } from './parse-query';

describe('parseQuery', () => {
    it('should return key-value pairs representing query', () => {
        expect(parseQuery('foo=123&bar=456')).toEqual([['foo', '123'], ['bar', '456']]);
    });

    it('should decode each value', () => {
        expect(parseQuery(`foo=${encodeURIComponent('русский')}`)).toEqual([['foo', 'русский']]);
    });

    it('should ignore consequest special characters', () => {
        expect(parseQuery('??foo=123&&&bar=456&&')).toEqual([['foo', '123'], ['bar', '456']]);
    });

    it('should return empty list if empty value provided', () => {
        expect(parseQuery()).toEqual([]);
        expect(parseQuery(null)).toEqual([]);
        expect(parseQuery(undefined)).toEqual([]);
        expect(parseQuery('')).toEqual([]);
        expect(parseQuery('???&&&')).toEqual([]);
    });
});

describe('getQueryParamsByKey', () => {
    it('should filter query params by key and return corresponding key-value pairs', () => {
        expect(getQueryParamsByKey('foo[]')('foo[]=123&bar=456&foo[]=789')).toEqual([
            ['foo[]', '123'],
            ['foo[]', '789'],
        ]);
    });

    it('should return empty list if no key related pairs found', () => {
        expect(getQueryParamsByKey('foo[]')('bar=123&baz=456')).toEqual([]);
    });

    it('should return empty list if no query provided', () => {
        expect(getQueryParamsByKey('foo[]')()).toEqual([]);
        expect(getQueryParamsByKey('foo[]')(null)).toEqual([]);
        expect(getQueryParamsByKey('foo[]')(undefined)).toEqual([]);
        expect(getQueryParamsByKey('foo[]')('')).toEqual([]);
    });
});

describe('getQueryValsByKey', () => {
    it('should filter query params by key and return values associated with provided key', () => {
        expect(getQueryValsByKey('foo[]')('foo[]=123&bar=456&foo[]=789')).toEqual(['123', '789']);
    });

    it('should return empty list if no key related values found', () => {
        expect(getQueryValsByKey('foo[]')('bar=123&baz=456')).toEqual([]);
    });

    it('should return empty list if no query provided', () => {
        expect(getQueryValsByKey('foo[]')()).toEqual([]);
        expect(getQueryValsByKey('foo[]')(null)).toEqual([]);
        expect(getQueryValsByKey('foo[]')(undefined)).toEqual([]);
        expect(getQueryValsByKey('foo[]')('')).toEqual([]);
    });
});
