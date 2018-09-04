// @flow
export type HALLink = {|
    href: string,
    templated?: boolean,
|};

export type HALResponse = {
    [string]: HALResponse | HALResponse[] | string | number | boolean,
    _embedded?: HALResponse,
    _links?: {
        self: HALLink,
        [string]: HALLink,
    },
};

export type SortingOrder = 'ASC' | 'DESC';

export type Sort = {|
    field: string,
    order: SortingOrder,
|};

export type GetListQuery = {
    sort?: Sort,
    page?: number,
    perPage?: number,
    [string]: mixed,
};

export type HALEndpoint<T> = {|
    getList: (query?: GetListQuery) => Promise<T[]>,
    getOne: (id?: string, query?: { [string]: mixed }) => Promise<T>,
    create: (data?: Object) => Promise<T>,
    delete: (id?: string) => Promise<void>,
    update: (id?: string, data?: Object) => Promise<T>,
    rawPost: (data?: Object, query?: { [string]: mixed }) => Promise<Response>,
    rawGet: (id?: string, query?: { [string]: mixed }) => Promise<Response>,
|};

export type HALEntity = {
    [string]: HALEntity | HALEntity[] | HALEndpoint<HALEntity> | string | number | boolean,
    id: string,
    _id?: string,
    _links?: {
        self: HALLink,
        [string]: HALLink,
    },
};

export type HALEndpointFactory = (endpointName: string) => HALEndpoint<HALEntity>;
