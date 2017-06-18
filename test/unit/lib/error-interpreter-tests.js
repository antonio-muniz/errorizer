'use strict';
/* global describe, it */

const should = require('should');

const ErrorInterpreter = require('../../../lib/error-interpreter');

describe('ErrorInterpreter', function () {

  describe('constructor', function () {

    it('should create an error interpreter for an error', function () {
      let error = { httpStatusCode: 400, errorMessage: 'The request is invalid' };
      let parameters = { prop: 'value' };

      let interpreter = new ErrorInterpreter(error, parameters);

      should.exist(interpreter);
      interpreter.should.be.instanceof(ErrorInterpreter);
      interpreter.should.have.property('error').which.is.eql(error);
      interpreter.should.have.property('parameters').which.is.eql(parameters);
      interpreter.should.have.property('getErrorMessage').which.is.a.Function();
      interpreter.should.have.property('getHttpStatusCode').which.is.a.Function();
    });

  });

  describe('getErrorMessage', function () {

    it('should return string error message', function () {
      let error = { errorMessage: 'The request is invalid' };

      let interpreter = new ErrorInterpreter(error);
      let errorMessage = interpreter.getErrorMessage();

      errorMessage.should.eql(error.errorMessage);
    });

    it('should return error message from function', function () {
      let messageToReturn = 'The request is invalid';
      let error = { errorMessage: () => messageToReturn };
      let parameters = { details: ', because it is not valid' };

      let interpreter = new ErrorInterpreter(error, parameters);
      let errorMessage = interpreter.getErrorMessage();

      errorMessage.should.eql(messageToReturn);
    });

    it('should pass params to error message function', function () {
      let baseMessage = 'The request is invalid';
      let error = {
        errorMessage: (parameters) => {
          return baseMessage + parameters.details;
        }
      };
      let parameters = { details: ', because it is not valid' };

      let interpreter = new ErrorInterpreter(error, parameters);
      let errorMessage = interpreter.getErrorMessage();

      errorMessage.should.eql(baseMessage + parameters.details);
    });

    it('should return nothing if no error message was given', function () {
      let error = {};

      let interpreter = new ErrorInterpreter(error);
      let errorMessage = interpreter.getErrorMessage();

      should.not.exist(errorMessage);
    });

    it('should throw an error if the error message is not a string', function () {
      let error = { errorMessage: {} };

      let interpreter = new ErrorInterpreter(error);
      (() => interpreter.getErrorMessage())
        .should.throw(`Invalid error message "${{}}". It must be a string`);
    });

  });

  describe('getHttpStatusCode', function () {

    it('should return valid number HTTP status code', function () {
      let error = { httpStatusCode: 404 };

      let interpreter = new ErrorInterpreter(error);
      let httpStatusCode = interpreter.getHttpStatusCode();

      httpStatusCode.should.eql(404);
    });

    it('should return HTTP status code from function', function () {
      let error = { httpStatusCode: () => 404 };

      let interpreter = new ErrorInterpreter(error);
      let httpStatusCode = interpreter.getHttpStatusCode();

      httpStatusCode.should.eql(404);
    });

    it('should pass params to HTTP status code function', function () {
      let error = {
        httpStatusCode: (parameters) => parameters.actualHttpStatusCode
      };
      let parameters = { actualHttpStatusCode: 502 };

      let interpreter = new ErrorInterpreter(error, parameters);
      let httpStatusCode = interpreter.getHttpStatusCode();

      httpStatusCode.should.eql(502);
    });

    it('should return 500 if no HTTP status code was given', function () {
      let error = {};

      let interpreter = new ErrorInterpreter(error);
      let httpStatusCode = interpreter.getHttpStatusCode();

      httpStatusCode.should.eql(500);
    });

    it('should throw an error if the HTTP status code is not valid', function () {
      let error = { httpStatusCode: 999 };

      let interpreter = new ErrorInterpreter(error);
      (() => interpreter.getHttpStatusCode())
        .should.throw(`Invalid HTTP status code ${error.httpStatusCode}`);
    });

  });

});
