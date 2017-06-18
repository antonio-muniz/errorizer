'use strict';

const path = require('path');
const util = require('util');

const ErrorMiddlewareFactory = require('./lib/error-middleware-factory');

const ERRORS_FILE = require('./lib/constants').ERRORS_FILE;

module.exports = (errors) => {
  if (util.isNullOrUndefined(errors)) {
    errors = getErrorsObject();
  }
  if (!util.isObject(errors)) {
    throw new Error('Error definition must be an object');
  }
  return ErrorMiddlewareFactory.create(Object.assign({}, errors));
};

function getErrorsObject() {
  try {
    return require(path.join(process.cwd(), ERRORS_FILE));
  }
  catch (err) {
    console.warn(`Cannot find ${ERRORS_FILE} file. Using defaults`);
    return {};
  }
}
