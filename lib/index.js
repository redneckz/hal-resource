'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pickLinkedEntities = function pickLinkedEntities(entities, key) {
    return Promise.all(entities.filter(function (entity) {
        return entity[key];
    }).map(function (entity) {
        return entity[key].getOne();
    }));
};


var pickLinkedEntitiesGroups = function pickLinkedEntitiesGroups(entities, key) {
    return Promise.all(entities.filter(function (entity) {
        return entity[key];
    }).map(function (entity) {
        return entity[key].getList();
    }));
};

function toQuery(obj) {
    if (!obj) {
        return '';
    }
    return Object.keys(obj).filter(function (key) {
        return obj && obj[key] !== undefined && obj[key] !== null;
    }).map(function (key) {
        return obj && [key, String(obj[key])].map(encodeURIComponent).join('=');
    }).join('&');
}

function parseQuery(query) {
    if (!query) {
        return [];
    }
    return query.split(/[&?]/).filter(Boolean).map(function (keyVal) {
        return keyVal.split('=');
    }).map(function (_ref) {
        var key = _ref[0],
            _ref$ = _ref[1],
            val = _ref$ === undefined ? '' : _ref$;
        return [key, decodeURIComponent(val)];
    });
}

function getQueryParamsByKey(targetKey) {
    return function (query) {
        return parseQuery(query).filter(function (_ref2) {
            var key = _ref2[0];
            return key === targetKey;
        });
    };
}

function getQueryValsByKey(targetKey) {
    return function (query) {
        return getQueryParamsByKey(targetKey)(query).map(function (_ref3) {
            var val = _ref3[1];
            return val;
        });
    };
}

function cleanupTemplatedHref(href) {
    return href ? href.replace(/{[^}]*}/g, '') : '';
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

function computeHALRequestURL(endpointHref) {
    var endpointURI = cleanupTemplatedHref(endpointHref);
    return function computeURL(idOrQuery, query) {
        if (idOrQuery && (typeof idOrQuery === 'undefined' ? 'undefined' : _typeof(idOrQuery)) === 'object') {
            // query is passed in place of id
            return computeURL(undefined, idOrQuery);
        }
        var id = idOrQuery;
        if (!id) {
            // endpointURI is the final URL
            return endpointURI + '?' + toQuery(query);
        }
        if (isURL(id)) {
            return id + '?' + toQuery(query);
        }
        return endpointURI + '/' + id + '?' + toQuery(query);
    };
}

function isURL(str) {
    return (str || '').indexOf('://') !== -1;
}

function prepareHALResponse(endpointFactory) {
    var mapResponse = function mapResponse() {
        var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var id = response.id,
            _embedded = response._embedded,
            _links = response._links,
            fields = objectWithoutProperties(response, ['id', '_embedded', '_links']);

        var _ref = _links || {},
            _ref$self = _ref.self;

        _ref$self = _ref$self === undefined ? {} : _ref$self;
        var selfHref = _ref$self.href;

        var entityBase = {
            get id() {
                return cleanupTemplatedHref(selfHref);
            }
        };
        var entityDescriptors = Object.assign.apply(Object, [{
            _id: { value: retrieveShortIdFromHref(selfHref) },
            _links: { value: _links }
        }].concat(computeFields(fields), computeEmbedded(_embedded), computeLinkedResources(_links)));
        return Object.defineProperties(entityBase, entityDescriptors);
    };
    return mapResponse;

    function computeEmbedded(embedded) {
        var _ref2 = embedded || {},
            id = _ref2.id,
            _links = _ref2._links,
            _embedded = _ref2._embedded,
            embeddedFields = objectWithoutProperties(_ref2, ['id', '_links', '_embedded']);

        return Object.keys(embeddedFields).map(function (key) {
            var _ref3;

            return _ref3 = {}, _ref3[key] = {
                value: computeFieldValue(embeddedFields[key] || ''),
                enumerable: true
            }, _ref3;
        });
    }

    function computeLinkedResources() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var self = _ref4.self,
            links = objectWithoutProperties(_ref4, ['self']);

        return links ? Object.keys(links).map(function (key) {
            var _ref5;

            return _ref5 = {}, _ref5[key] = {
                value: endpointFactory(links[key].href)
            }, _ref5;
        }) : [];
    }

    function computeFields(fields) {
        return Object.keys(fields).map(function (key) {
            var _ref6;

            return _ref6 = {}, _ref6[key] = {
                value: computeFieldValue(fields[key]),
                enumerable: true
            }, _ref6;
        });
    }

    function computeFieldValue(val) {
        if (Array.isArray(val)) {
            return val.map(computeFieldValue);
        }
        if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            return mapResponse(val);
        }
        return val;
    }
}

function retrieveShortIdFromHref(href) {
    var cleanHref = cleanupTemplatedHref(href);
    return cleanHref.substr(cleanHref.lastIndexOf('/') + 1);
}

function unwrapEmbeddedList(obj) {
    if (!obj || !obj._embedded) {
        return [];
    }
    var embed = obj._embedded;

    var _Object$keys = Object.keys(embed),
        onlyKey = _Object$keys[0];

    return Array.isArray(embed[onlyKey]) ? embed[onlyKey] : [];
}

function HALResource(doFetch) {
    var endpointFactory = function endpointFactory(endpointURI) {
        var fetchJSON = doFetchJSON(doFetch);
        var computeURL = computeHALRequestURL(endpointURI);
        return {
            getList: function () {
                var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    var _ref$sort = _ref.sort;
                    _ref$sort = _ref$sort === undefined ? {} : _ref$sort;
                    var sortField = _ref$sort.field,
                        order = _ref$sort.order,
                        query = objectWithoutProperties(_ref, ['sort']);
                    var sort, response, list;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    sort = sortField ? sortField + ',' + order.toLowerCase() : undefined;
                                    _context.next = 3;
                                    return fetchJSON(computeURL(_extends({}, query, { sort: sort })));

                                case 3:
                                    response = _context.sent;
                                    _context.t0 = unwrapEmbeddedList;
                                    _context.next = 7;
                                    return response.json();

                                case 7:
                                    _context.t1 = _context.sent;
                                    list = (0, _context.t0)(_context.t1);
                                    return _context.abrupt('return', list.map(prepareHALResponse(endpointFactory)));

                                case 10:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function getList() {
                    return _ref2.apply(this, arguments);
                }

                return getList;
            }(),
            getOne: function () {
                var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, query) {
                    var response;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.next = 2;
                                    return fetchJSON(computeURL(id, query));

                                case 2:
                                    response = _context2.sent;
                                    _context2.t0 = prepareHALResponse(endpointFactory);
                                    _context2.next = 6;
                                    return response.json();

                                case 6:
                                    _context2.t1 = _context2.sent;
                                    return _context2.abrupt('return', (0, _context2.t0)(_context2.t1));

                                case 8:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function getOne(_x2, _x3) {
                    return _ref3.apply(this, arguments);
                }

                return getOne;
            }(),
            create: function () {
                var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
                    var response;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.next = 2;
                                    return fetchJSON(computeURL(), {
                                        method: 'POST',
                                        body: JSON.stringify(data || {})
                                    });

                                case 2:
                                    response = _context3.sent;
                                    _context3.t0 = prepareHALResponse(endpointFactory);
                                    _context3.next = 6;
                                    return response.json();

                                case 6:
                                    _context3.t1 = _context3.sent;
                                    return _context3.abrupt('return', (0, _context3.t0)(_context3.t1));

                                case 8:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));

                function create(_x4) {
                    return _ref4.apply(this, arguments);
                }

                return create;
            }(),
            delete: function () {
                var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _context4.next = 2;
                                    return fetchJSON(computeURL(id), { method: 'DELETE' });

                                case 2:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                function _delete(_x5) {
                    return _ref5.apply(this, arguments);
                }

                return _delete;
            }(),
            update: function () {
                var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(id, data) {
                    var response;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    _context5.next = 2;
                                    return fetchJSON(computeURL(id), {
                                        method: 'PATCH',
                                        body: JSON.stringify(data || {})
                                    });

                                case 2:
                                    response = _context5.sent;
                                    _context5.t0 = prepareHALResponse(endpointFactory);
                                    _context5.next = 6;
                                    return response.json();

                                case 6:
                                    _context5.t1 = _context5.sent;
                                    return _context5.abrupt('return', (0, _context5.t0)(_context5.t1));

                                case 8:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));

                function update(_x6, _x7) {
                    return _ref6.apply(this, arguments);
                }

                return update;
            }(),
            rawGet: function rawGet(id, query) {
                return fetchJSON(computeURL(id, query));
            },
            rawPost: function rawPost(data) {
                return fetchJSON(computeURL(), {
                    method: 'POST',
                    body: JSON.stringify(data || {})
                });
            }
        };
    };
    return endpointFactory;
}

function doFetchJSON(doFetch) {
    return function (url, options) {
        var opts = _extends({}, options, {
            headers: _extends({}, options && options.headers ? options.headers : {}, {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window && window.location.host && window.location.host.indexOf('localhost') !== 0 ? {
                'X-Forwarded-Host': window.location.host
            } : {})
        });
        return doFetch(url, opts);
    };
}

exports.HALResource = HALResource;
exports.pickLinkedEntities = pickLinkedEntities;
exports.pickLinkedEntitiesGroups = pickLinkedEntitiesGroups;
exports.toQuery = toQuery;
exports.parseQuery = parseQuery;
exports.getQueryParamsByKey = getQueryParamsByKey;
exports.getQueryValsByKey = getQueryValsByKey;
//# sourceMappingURL=index.js.map
