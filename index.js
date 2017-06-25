'use strict';

const ErrorMiddlewareFactory = require('./lib/error-middleware-factory');

module.exports = (errors) => {
  errors = errors || {};
  if (!(errors instanceof Object)) {
    throw new Error('Error definition must be an object');
  }
  return ErrorMiddlewareFactory.create(Object.assign({}, errors));
};
