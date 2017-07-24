'use strict';
/* global describe,it */

require('should');

const ErrorizerError = require('../../../../lib/utils/errorizer-error');
const ErrorValidator = require('../../../../lib/validation/error-validator');

describe('ErrorValidator', function () {

  describe('validate', function () {

    it('should not throw for valid errors', function () {
      let code = 'INVALID_REQUEST';
      let error = {
        status: 400,
        message: 'The request is invalid',
        detail: {
          description: 'This error occurs when the request is invalid',
          docs: 'https://docs.myapp.com/errors/INVALID_REQUEST'
        }
      };

      (() => ErrorValidator.validate(code, error)).should.not.throw();

      error.detail = 'https://docs.myapp.com/errors/INVALID_REQUEST';

      (() => ErrorValidator.validate(code, error)).should.not.throw();

      error.detail = ['inner error 1', 'inner error 2', 'inner error 3'];

      (() => ErrorValidator.validate(code, error)).should.not.throw();
    });

    it('should throw for no error', function () {
      (() => ErrorValidator.validate('NONE', null))
        .should.throwError(new ErrorizerError('No error for "NONE"'));
      (() => ErrorValidator.validate('NONE'))
        .should.throwError(new ErrorizerError('No error for "NONE"'));
    });

    it('should throw for non-object error', function () {
      (() => ErrorValidator.validate('NO', 'just no'))
        .should.throwError(new ErrorizerError('"NO" error is not an object: "just no"'));
      (() => ErrorValidator.validate('FAILED', true))
        .should.throwError(new ErrorizerError('"FAILED" error is not an object: "true"'));
    });

    it('should throw for missing status', function () {
      let code = 'NO_STATUS';
      let error = {
        message: 'No status'
      };

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('Missing status for error "NO_STATUS"'));

      error.status = null;

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('Missing status for error "NO_STATUS"'));
    });

    it('should throw for invalid status', function () {
      let code = 'EVIL_ERROR';
      let error = {
        status: 666,
        message: 'Mwahahaha!'
      };

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('"EVIL_ERROR" status is not a valid HTTP status code: "666"'));
    });

    it('should throw for missing message', function () {
      let code = 'NO_MESSAGE';
      let error = {
        status: 400
      };

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('Missing message for error "NO_MESSAGE"'));

      error.message = null;

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('Missing message for error "NO_MESSAGE"'));
    });

    it('should throw for non-string message', function () {
      let code = 'WEIRD_MESSAGE';
      let error = {
        status: 400,
        message: {
          text: 'The message is here'
        }
      };

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('"WEIRD_MESSAGE" message is not a string: "[object Object]"'));

      error.message = false;

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('"WEIRD_MESSAGE" message is not a string: "false"'));
    });

    it('should throw for non-string, non-object detail', function () {
      let code = 'BUGGED_DETAIL';
      let error = {
        status: 400,
        message: 'The request is invalid',
        detail: 1024
      };

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('"BUGGED_DETAIL" detail is not a string, object or array: "1024"'));

      error.detail = true;

      (() => ErrorValidator.validate(code, error))
        .should.throwError(new ErrorizerError('"BUGGED_DETAIL" detail is not a string, object or array: "true"'));
    });

  });

});
