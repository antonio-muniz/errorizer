'use strict';

const constants = require('../constants');

const DEFAULT_ERROR_CODE = constants.DEFAULT_ERROR_CODE;

class ErrorInfoInterpreter {

  constructor(errors) {
    this.errors = errors;
  }

  interpret(err) {
    let code, properties;

    if (typeof err == 'string') {
      code = err;
    }
    else if (err instanceof Error) {
      code = err.message;
    }
    else if (err instanceof Object) {
      code = err.code;
      properties = err.properties;
    }
    else {
      code = DEFAULT_ERROR_CODE;
    }

    if (!this.errors[code]) {
      code = DEFAULT_ERROR_CODE;
    }

    return { code, properties };
  }

}

module.exports = ErrorInfoInterpreter;
