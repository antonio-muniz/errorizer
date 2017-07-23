'use strict';

const ErrorFunctionRunner = require('./error-function-runner');
const ErrorValidator = require('../validation/error-validator');

class ErrorResponseFactory {

  constructor(errors) {
    this.errors = errors;
  }

  create(errorInfo) {
    let errorDefinition = this.errors[errorInfo.code];

    let error;

    switch (typeof errorDefinition) {
      case 'object': error = Object.assign({}, errorDefinition); break;
      case 'function': error = ErrorFunctionRunner.run(errorDefinition, errorInfo); break;
    }

    ErrorValidator.validate(errorInfo.code, error);

    error.code = errorInfo.code;

    return error;
  }

}

module.exports = ErrorResponseFactory;
