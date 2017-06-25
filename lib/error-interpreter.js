'use strict';

const util = require('util');

const STATUS_CODES = require('./constants').STATUS_CODES;

class ErrorInterpreter {

  constructor(error, params) {
    this.error = error;
    this.params = params || {};
  }

  getMessage() {
    let message = (util.isFunction(this.error.message))
      ? this.error.message(this.params)
      : this.error.message;

    if (util.isNullOrUndefined(message)) {
      return;
    }
    if (!util.isString(message)) {
      throw new Error(`Invalid error message "${message}". It must be a string`);
    }
    return message;
  }

  getStatus() {
    let status = (util.isFunction(this.error.status))
      ? this.error.status(this.params)
      : this.error.status;

    if (util.isNullOrUndefined(status)) {
      return 500;
    }
    if (util.isUndefined(STATUS_CODES[status])) {
      throw new Error(`Invalid HTTP status code ${status}`);
    }
    return status;
  }

}

module.exports = ErrorInterpreter;
