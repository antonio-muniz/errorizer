'use strict';

const ERRORS_FILE = './.errors.js';

const { STATUS_CODES } = require('http');

const DEFAULT_ERROR_CODE = 'UNEXPECTED_ERROR';

const DEFAULT_ERROR = {
  httpStatusCode: 500,
  errorMessage: 'An unexpected error has occurred while fulfilling the request'
};

module.exports = {
  ERRORS_FILE,
  STATUS_CODES,
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR
};
