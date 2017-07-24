'use strict';

const ErrorizerError = require('../utils/errorizer-error');
const ErrorValidator = require('./error-validator');

class ErrorDefinitionsValidator {

  static validate(errorDefinitions) {
    if (!errorDefinitions) {
      throw new ErrorizerError('Error definitions are required');
    }
    if (!(errorDefinitions instanceof Object)) {
      throw new ErrorizerError(`Error definitions are not an object: "${errorDefinitions}"`);
    }

    let errorCodes = Object.keys(errorDefinitions);

    for (let code of errorCodes) {
      if (code.length == 0) {
        throw new ErrorizerError('Empty string is not a valid error code');
      }
      let errorDefinition = errorDefinitions[code];
      if (typeof errorDefinition == 'function') {
        continue;
      }
      else if (errorDefinition instanceof Object) {
        ErrorValidator.validate(code, errorDefinitions[code]);
      }
      else {
        throw new ErrorizerError(`"${code}" is not an object or a function: "${errorDefinition}"`);
      }
    }
  }

}

module.exports = ErrorDefinitionsValidator;
