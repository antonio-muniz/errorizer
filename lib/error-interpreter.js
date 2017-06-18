'use strict';

const util = require('util');

const STATUS_CODES = require('./constants').STATUS_CODES;

class ErrorInterpreter {

  constructor(error, parameters) {
    this.error = error;
    this.parameters = parameters || {};
  }

  getErrorMessage() {
    let errorMessage = (util.isFunction(this.error.errorMessage))
      ? this.error.errorMessage(this.parameters)
      : this.error.errorMessage;

    if (util.isNullOrUndefined(errorMessage)) {
      return;
    }
    if (!util.isString(errorMessage)) {
      throw new Error(`Invalid error message "${errorMessage}". It must be a string`);
    }
    return errorMessage;
  }

  getHttpStatusCode() {
    let httpStatusCode = (util.isFunction(this.error.httpStatusCode))
      ? this.error.httpStatusCode(this.parameters)
      : this.error.httpStatusCode;

    if (util.isNullOrUndefined(httpStatusCode)) {
      return 500;
    }
    if (util.isUndefined(STATUS_CODES[httpStatusCode])) {
      throw new Error(`Invalid HTTP status code ${httpStatusCode}`);
    }
    return httpStatusCode;
  }

}

module.exports = ErrorInterpreter;
