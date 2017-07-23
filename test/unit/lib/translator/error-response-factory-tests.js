'use strict';
/* global describe,it */

const should = require('should');

const ErrorResponseFactory = require('../../../../lib/translator/error-response-factory');

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
  },
  BUGGED_ERROR: (errorInfo) => {
    return 'bug';
  }
};

describe('ErrorResponseFactory', function () {

  describe('constructor', function () {

    it('should create an error response factory for the error definitions', function () {
      let factory = new ErrorResponseFactory(errors);

      factory.should.be.instanceOf(ErrorResponseFactory);
      factory.should.have.property('errors', errors);
      factory.should.have.property('create').which.is.a.Function();
    });

  });

  describe('create', function () {

    it('should create an error response for the specified error info', function () {
      let factory = new ErrorResponseFactory(errors);

      let code = 'INVALID_REQUEST';

      let errorResponse = factory.create({ code });
      should.exist(errorResponse);
      errorResponse.should.eql({
        code,
        status: errors[code].status,
        message: errors[code].message,
        detail: errors[code].detail
      });
    });

    it('should create an error response from an error function', function () {
      let factory = new ErrorResponseFactory(errors);

      let code = 'INVALID_PARAMETER';
      let properties = { parameter: 'name' };

      let generatedError = errors[code]({ code, properties });

      let errorResponse = factory.create({ code, properties });
      should.exist(errorResponse);
      errorResponse.should.eql({
        code,
        status: generatedError.status,
        message: generatedError.message,
        detail: generatedError.detail
      });
    });

    it('should validate errors returned by error functions', function () {
      let factory = new ErrorResponseFactory(errors);

      let code = 'BUGGED_ERROR';

      (() => factory.create({ code })).should.throwError();
    });

  });

});
