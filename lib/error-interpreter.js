'use strict';

const util = require('util');

const STATUS_CODES = require('./constants').STATUS_CODES;

class ErrorInterpreter {

  constructor(error, parameters) {
    this.error = error;
    this.parameters = parameters || {};
  }

  getMessage() {
    let message = (util.isFunction(this.error.message))
      ? this.error.message(this.parameters)
      : this.error.message;

    if (util.isNullOrUndefined(message)) {
      return;
    }
    if (!util.isString(message)) {
      throw new Error(`Invalid error message "${message}". It must be a string`);
    }
    return message;
  }

  getStatusCode() {
    let statusCode = (util.isFunction(this.error.statusCode))
      ? this.error.statusCode(this.parameters)
      : this.error.statusCode;

    if (util.isNullOrUndefined(statusCode)) {
      return 500;
    }
    if (util.isUndefined(STATUS_CODES[statusCode])) {
      throw new Error(`Invalid HTTP status code ${statusCode}`);
    }
    return statusCode;
  }

}

module.exports = ErrorInterpreter;
