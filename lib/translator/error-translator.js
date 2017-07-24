'use strict';

const constants = require('../constants');
const ErrorInfoInterpreter = require('./error-info-interpreter');
const ErrorResponseFactory = require('./error-response-factory');

class ErrorTranslator {

  constructor(errors) {
    errors[constants.DEFAULT_ERROR_CODE] = constants.DEFAULT_ERROR;
    this.errorInfoInterpreter = new ErrorInfoInterpreter(errors);
    this.errorResponseFactory = new ErrorResponseFactory(errors);
  }

  translate(err) {
    let errorInfo = this.errorInfoInterpreter.interpret(err);
    let errorResponse = this.errorResponseFactory.create(errorInfo);

    return {
      status: errorResponse.status,
      code: errorInfo.code,
      message: errorResponse.message,
      detail: errorResponse.detail
    };
  }

}

module.exports = ErrorTranslator;
