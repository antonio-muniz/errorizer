'use strict';

class ErrorizerError extends Error {

  constructor(message) {
    super(`[errorizer] ${message}`);
    this.name = 'ErrorizerError';
  }

}

module.exports = ErrorizerError;
