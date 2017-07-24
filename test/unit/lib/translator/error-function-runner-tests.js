'use strict';
/* global describe,it */

require('should');

const ErrorFunctionRunner = require('../../../../lib/translator/error-function-runner');
const ErrorizerError = require('../../../../lib/utils/errorizer-error');

describe('ErrorFunctionRunner', function () {

  describe('run', function () {

    it('should pass the error info to the error function and return its output', function () {
      let errorFunction = (errorInfo) => {
        return `The code is ${errorInfo.code}`;
      };
      let errorInfo = { code: 'INVALID_REQUEST' };

      let result = ErrorFunctionRunner.run(errorFunction, errorInfo);

      result.should.eql(`The code is ${errorInfo.code}`);
    });

    it('should throw if the error function throws', function () {
      let errorMessage = 'Oops!';
      let errorFunction = (errorInfo) => {
        throw new Error(errorMessage);
      };
      let errorInfo = { code: 'INVALID_REQUEST' };

      let expectedError = new ErrorizerError(`${errorInfo.code} function threw an error: ${errorMessage}`);

      (() => ErrorFunctionRunner.run(errorFunction, errorInfo))
        .should.throwError(expectedError);
    });

  });

});
