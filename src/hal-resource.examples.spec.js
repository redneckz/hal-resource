// @flow
import { HALResource } from './hal-resource';

describe('HALResource examples', () => {
    const defaultHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

    test('Retrieving posts list', async () => {
        const doFetch: typeof fetch = jest.fn(
            (() =>
                Promise.resolve({
                    json: () => ({
                        _embedded: {
                            posts: [
                                {
                                    title: 'Hello!',
                                    body: 'World!',
                                    _links: {
                                        self: { href: 'https://host:port/posts/1' },
                                    },
                                },
                            ],
                        },
                        _links: {
                            self: {
                                href: 'https://host:port/posts{?page,size,sort,projection}',
                                templated: true,
                            },
                        },
                    }),
                }): any),
        );
        const postsResource = HALResource(doFetch)('posts');
        expect(await postsResource.getList()).toEqual([
            {
                id: 'https://host:port/posts/1',
                title: 'Hello!',
                body: 'World!',
            },
        ]);
        expect(doFetch).toHaveBeenCalledTimes(1);
        expect(doFetch).toHaveBeenCalledWith('posts?', {
            headers: defaultHeaders,
        });
    });

    test('Retrieving one post by ID', async () => {
        const doFetch: typeof fetch = jest.fn(
            (() =>
                Promise.resolve({
                    json: () => ({
                        title: 'Hello!',
                        body: 'World!',
                        _links: {
                            self: { href: 'https://host:port/posts/1' },
                        },
                    }),
                }): any),
        );
        const postsResource = HALResource(doFetch)('posts');
        expect(await postsResource.getOne('1')).toEqual({
            id: 'https://host:port/posts/1',
            title: 'Hello!',
            body: 'World!',
        });
        expect(doFetch).toHaveBeenCalledTimes(1);
        expect(doFetch).toHaveBeenCalledWith('posts/1?', {
            headers: defaultHeaders,
        });
    });

    test('Retrieving one post by ID with query', async () => {
        const doFetch: typeof fetch = jest.fn(
            (() =>
                Promise.resolve({
                    json: () => ({
                        title: 'Hello!',
                        body: 'World!',
                        _links: {
                            self: { href: 'https://host:port/posts/1' },
                        },
                    }),
                }): any),
        );
        const postsResource = HALResource(doFetch)('posts');
        expect(await postsResource.getOne('1', { foo: '123' })).toEqual({
            id: 'https://host:port/posts/1',
            title: 'Hello!',
            body: 'World!',
        });
        expect(doFetch).toHaveBeenCalledTimes(1);
        expect(doFetch).toHaveBeenCalledWith('posts/1?foo=123', {
            headers: defaultHeaders,
        });
    });

    test('Creating new post', async () => {
        const doFetch: typeof fetch = jest.fn(
            ((url, { body }) =>
                Promise.resolve({
                    json: () => ({
                        ...JSON.parse(body),
                        _links: {
                            self: { href: 'https://host:port/posts/1' },
                        },
                    }),
                }): any),
        );
        const postsResource = HALResource(doFetch)('posts');
        const newGreetingPost = {
            title: 'Hello!',
            body: 'World!',
        };
        expect(await postsResource.create(newGreetingPost)).toEqual({
            id: 'https://host:port/posts/1',
            ...newGreetingPost,
        });
        expect(doFetch).toHaveBeenCalledTimes(1);
        expect(doFetch).toHaveBeenCalledWith('posts?', {
            method: 'POST',
            body: JSON.stringify(newGreetingPost),
            headers: defaultHeaders,
        });
    });

    test('Updating some post by ID', async () => {
        const doFetch: typeof fetch = jest.fn(
            ((url, { body }) =>
                Promise.resolve({
                    json: () => ({
                        ...JSON.parse(body),
                        _links: {
                            self: { href: 'https://host:port/posts/1' },
                        },
                    }),
                }): any),
        );
        const postsResource = HALResource(doFetch)('posts');
        const updatedGreetingPost = {
            title: 'Hello!',
            body: 'World!',
        };
        expect(await postsResource.update('1', updatedGreetingPost)).toEqual({
            id: 'https://host:port/posts/1',
            ...updatedGreetingPost,
        });
        expect(doFetch).toHaveBeenCalledTimes(1);
        expect(doFetch).toHaveBeenCalledWith('posts/1?', {
            method: 'PATCH',
            body: JSON.stringify(updatedGreetingPost),
            headers: defaultHeaders,
        });
    });

    test('Delete some post by ID', async () => {
        const doFetch: typeof fetch = jest.fn((() => Promise.resolve(): any));
        const postsResource = HALResource(doFetch)('posts');
        expect(await postsResource.delete('1')).toBe(undefined);
        expect(doFetch).toHaveBeenCalledTimes(1);
        expect(doFetch).toHaveBeenCalledWith('posts/1?', {
            method: 'DELETE',
            headers: defaultHeaders,
        });
    });
});
