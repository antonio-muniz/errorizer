'use strict';

const constants = require('../constants');

const DEFAULT_ERROR_CODE = constants.DEFAULT_ERROR_CODE;

class ErrorInfoInterpreter {

  constructor(errors) {
    this.errors = errors;
  }

  interpret(err) {
    let code, custom;

    if (typeof err == 'string') {
      code = err;
    }
    else if (err instanceof Error) {
      if (err.message instanceof Object) {
        code = err.message.code;
        custom = err.message.custom;
      } else {
        code = err.message;
      }
    }
    else if (err instanceof Object) {
      code = err.code;
      custom = err.custom;
    }
    else {
      code = DEFAULT_ERROR_CODE;
    }

    if (!this.errors[code]) {
      code = DEFAULT_ERROR_CODE;
    }

    return { code, custom };
  }

}

module.exports = ErrorInfoInterpreter;
