'use strict';

const constants = require('../constants');
const ErrorizerError = require('../utils/errorizer-error');

const STATUS_CODES = constants.STATUS_CODES;

class ErrorValidator {

  static validate(code, error) {
    if (!error) {
      throw new ErrorizerError(`No error for "${code}"`);
    }
    if (!(error instanceof Object)) {
      throw new ErrorizerError(`"${code}" error is not an object: "${error}"`);
    }
    if (!error.status) {
      throw new ErrorizerError(`Missing status for error "${code}"`);
    }
    if (!STATUS_CODES[error.status]) {
      throw new ErrorizerError(`"${code}" status is not a valid HTTP status code: "${error.status}"`);
    }
    if (!error.message) {
      throw new ErrorizerError(`Missing message for error "${code}"`);
    }
    if (typeof error.message != 'string') {
      throw new ErrorizerError(`"${code}" message is not a string: "${error.message}"`);
    }
    if (error.detail && typeof error.detail != 'string' && !(error.detail instanceof Object)) {
      throw new ErrorizerError(`"${code}" detail is not a string, object or array: "${error.detail}"`);
    }
  }

}

module.exports = ErrorValidator;
