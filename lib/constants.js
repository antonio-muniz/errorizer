'use strict';

const STATUS_CODES = require('http').STATUS_CODES;

const DEFAULT_ERROR_CODE = 'UNEXPECTED_ERROR';

const DEFAULT_ERROR = {
  statusCode: 500,
  message: 'An unexpected error has occurred while fulfilling the request'
};

module.exports = {
  STATUS_CODES,
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR
};
