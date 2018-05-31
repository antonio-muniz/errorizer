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
      let parseOfMessage;
      
      try {
          parseOfMessage = JSON.parse(err.message);
      } catch (e) {
          parseOfMessage = err.message;
      }
      
      if (parseOfMessage instanceof Object) {
        code = parseOfMessage.code;
        custom = parseOfMessage.custom;
      } else {
        code = parseOfMessage;
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
