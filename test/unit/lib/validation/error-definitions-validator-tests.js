'use strict';
/* global describe,it */

require('should');

const ErrorDefinitionsValidator = require('../../../../lib/validation/error-definitions-validator');
const ErrorizerError = require('../../../../lib/utils/errorizer-error');

describe('ErrorDefinitionsValidator', function () {

  describe('validate', function () {

    it('should accept valid error definitions', function () {
      const errors = {
        INVALID_REQUEST: {
          status: 400,
          message: 'The request is invalid',
          detail: {
            description: 'This error occurs when the request is invalid',
            docs: 'https://docs.myapp.com/errors/INVALID_REQUEST'
          }
        },
        INVALID_PARAMETER: (errorInfo) => {
          return {
            status: 400,
            message: `The "${errorInfo.parameter}" is invalid`,
            detail: {
              description: 'This error occurs when a parameter is invalid',
              docs: 'https://docs.myapp.com/errors/INVALID_PARAMETER'
            }
          };
        }
      };

      (() => ErrorDefinitionsValidator.validate(errors)).should.not.throw();
    });

    it('should throw for no error definitions', function () {
      (() => ErrorDefinitionsValidator.validate(null))
        .should.throwError(new ErrorizerError('Error definitions are required'));
      (() => ErrorDefinitionsValidator.validate())
        .should.throwError(new ErrorizerError('Error definitions are required'));
    });

    it('should throw for non-object error definitions', function () {
      (() => ErrorDefinitionsValidator.validate('errors'))
        .should.throwError(new ErrorizerError('Error definitions are not an object: "errors"'));
      (() => ErrorDefinitionsValidator.validate(404))
        .should.throwError(new ErrorizerError('Error definitions are not an object: "404"'));
    });

    it('should throw for empty string error code', function () {
      let errors = {
        '': {
          status: 400,
          message: '...'
        }
      };

      (() => ErrorDefinitionsValidator.validate(errors))
        .should.throwError(new ErrorizerError('Empty string is not a valid error code'));
    });

    it('should throw for non-object, non-function error definition', function () {
      let errors = {
        STRING_ERROR: 'This is an error'
      };

      (() => ErrorDefinitionsValidator.validate(errors))
        .should.throwError(new ErrorizerError('"STRING_ERROR" is not an object or a function: "This is an error"'));
    });

    it('should throw for invalid error definition', function () {
      let errors = {
        EVIL_ERROR: {
          status: 666,
          message: 'Mwahahaha!'
        }
      };

      (() => ErrorDefinitionsValidator.validate(errors))
        .should.throwError(new ErrorizerError('"EVIL_ERROR" status is not a valid HTTP status code: "666"'));
    });

  });

});
