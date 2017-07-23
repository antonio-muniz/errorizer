'use strict';

const ErrorizerError = require('../utils/errorizer-error');

class ErrorFunctionRunner {

  static run(errorFunction, errorInfo) {
    let error;

    try {
      error = errorFunction(errorInfo);
    }
    catch (err) {
      throw new ErrorizerError(`${errorInfo.code} function threw an error: ${err.message}`);
    }

    return error;
  }

}

module.exports = ErrorFunctionRunner;
