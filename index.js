'use strict';

const ErrorDefinitionsValidator = require('./lib/validation/error-definitions-validator');
const ErrorMiddlewareFactory = require('./lib/error-middleware-factory');

module.exports = (errors) => {
  ErrorDefinitionsValidator.validate(errors);
  return ErrorMiddlewareFactory.create(Object.assign({}, errors));
};
