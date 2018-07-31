# hal-resource

[REST+HAL](http://stateless.co/hal_specification.html) client for Browser and NodeJS

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

# Getting Started

## Installation

```bash
$ npm install --save @redneckz/hal-resource
```

```bash
$ yarn add @redneckz/hal-resource
```

## Basics

```js
import { HALResource } from '@redneckz/hal-resource';

const resource = HALResource(window.fetch); // Axios can be used for NodeJS

const customersResource = resource('https://foo.com/api/v1/customers');

const sortedCustomers = customersResource.getList({ sort: { field: 'name', order: 'ASC' } });
sortedCustomers.then(console.log);

const firstCustomer = customersResource.getOne('first-customer-id');
firstCustomer.then(console.log);

const newCustomer = customersResource.create({ name: 'New Customer' });
newCustomer.then(console.log);

customersResource.delete('first-customer-id');
```

# License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://badge.fury.io/js/%40redneckz%2Fhal-resource.svg
[npm-url]: https://www.npmjs.com/package/%40redneckz%2Fhal-resource
[travis-image]: https://travis-ci.org/redneckz/hal-resource.svg?branch=master
[travis-url]: https://travis-ci.org/redneckz/hal-resource
[coveralls-image]: https://coveralls.io/repos/github/redneckz/hal-resource/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/redneckz/hal-resource?branch=master
