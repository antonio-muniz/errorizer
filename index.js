'use strict';

const util = require('util');

const ErrorMiddlewareFactory = require('./lib/error-middleware-factory');

module.exports = (errors) => {
  errors = errors || {};
  if (!util.isObject(errors)) {
    throw new Error('Error definition must be an object');
  }
  return ErrorMiddlewareFactory.create(Object.assign({}, errors));
};
