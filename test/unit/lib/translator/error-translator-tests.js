'use strict';
/* global describe,it */

const should = require('should');

const constants = require('../../../../lib/constants');
const ErrorInfoInterpreter = require('../../../../lib/translator/error-info-interpreter');
const ErrorResponseFactory = require('../../../../lib/translator/error-response-factory');
const ErrorTranslator = require('../../../../lib/translator/error-translator');

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

describe('ErrorTranslator', function () {

  describe('constructor', function () {

    it('should create an error translator for the errors', function () {
      let translator = new ErrorTranslator(errors);

      translator.should.be.instanceOf(ErrorTranslator);
      translator.should.have.property('errorInfoInterpreter').which.is.instanceOf(ErrorInfoInterpreter);
      translator.should.have.property('errorResponseFactory').which.is.instanceOf(ErrorResponseFactory);
      translator.should.have.property('translate').which.is.a.Function();

      let errorInfoInterpreterErrors = translator.errorInfoInterpreter.errors;
      let errorResponseFactoryErrors = translator.errorResponseFactory.errors;

      let expectedErrors = Object.assign({}, errors);
      expectedErrors[constants.DEFAULT_ERROR_CODE] = constants.DEFAULT_ERROR;

      errorInfoInterpreterErrors.should.eql(expectedErrors).and.eql(errorResponseFactoryErrors);
    });

  });

  describe('translate', function () {

    it('should translate a known error to its error response', function () {
      let translator = new ErrorTranslator(errors);

      let code = 'INVALID_REQUEST';

      let errorResponse = translator.translate(code);

      should.exist(errorResponse);
      errorResponse.should.eql({
        status: errors[code].status,
        code,
        message: errors[code].message,
        detail: errors[code].detail
      });
    });

    it('should translate an unknown error to the default error response', function () {
      let translator = new ErrorTranslator(errors);

      let code = 'UNKNOWN_ERROR';

      let errorResponse = translator.translate(code);

      should.exist(errorResponse);
      errorResponse.should.eql({
        status: constants.DEFAULT_ERROR.status,
        code: constants.DEFAULT_ERROR_CODE,
        message: constants.DEFAULT_ERROR.message,
        detail: constants.DEFAULT_ERROR.detail
      });
    });

  });

});
