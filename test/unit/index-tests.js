'use strict';
/* global describe,it */

const should = require('should');

const errorizer = require('../../index');
const ErrorizerError = require('../../lib/utils/errorizer-error');

describe('index', function () {

  it('should return an Express error middleware for the error definitions', function () {
    const errors = {
      INVALID_REQUEST: {
        status: 400,
        message: 'The request is invalid',
        detail: {
          description: 'This error occurs when the request is invalid',
          docs: 'https://docs.myapp.com/errors/INVALID_REQUEST'
        }
      }
    };

    const errorMiddleware = errorizer(errors);
    should.exist(errorMiddleware);
    errorMiddleware.should.be.a.Function();
    errorMiddleware.should.have.length(4);
  });

  it('should validate the error definitions', function () {
    const errors = {
      INVALID_REQUEST: {
        status: 400,
        message: 'The request is invalid',
        detail: {
          description: 'This error occurs when the request is invalid',
          docs: 'https://docs.myapp.com/errors/INVALID_REQUEST'
        }
      },
      BUGGED_ERROR: {}
    };

    (() => errorizer(errors))
      .should.throwError(new ErrorizerError('Missing status for error "BUGGED_ERROR"'));
  });

});
