'use strict';

const STATUS_CODES = require('./constants').STATUS_CODES;

class ErrorInterpreter {

  constructor(error, params) {
    this.error = error;
    this.params = params || {};
  }

  getMessage() {
    let message = (typeof this.error.message == 'function')
      ? this.error.message(this.params)
      : this.error.message;

    if (message === null || message === undefined) {
      return;
    }
    if (typeof message != 'string') {
      throw new Error(`Invalid error message "${message}". It must be a string`);
    }
    return message;
  }

  getStatus() {
    let status = (typeof this.error.status == 'function')
      ? this.error.status(this.params)
      : this.error.status;

    if (status === null || status === undefined) {
      return 500;
    }
    if (!STATUS_CODES[status]) {
      throw new Error(`Invalid HTTP status code ${status}`);
    }
    return status;
  }

}

module.exports = ErrorInterpreter;
