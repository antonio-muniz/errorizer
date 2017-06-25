'use strict';
/* global describe, it */

const should = require('should');

const ErrorInterpreter = require('../../../lib/error-interpreter');

describe('ErrorInterpreter', function () {

  describe('constructor', function () {

    it('should create an error interpreter for an error', function () {
      let error = { statusCode: 400, message: 'The request is invalid' };
      let parameters = { prop: 'value' };

      let interpreter = new ErrorInterpreter(error, parameters);

      should.exist(interpreter);
      interpreter.should.be.instanceof(ErrorInterpreter);
      interpreter.should.have.property('error').which.is.eql(error);
      interpreter.should.have.property('parameters').which.is.eql(parameters);
      interpreter.should.have.property('getMessage').which.is.a.Function();
      interpreter.should.have.property('getStatusCode').which.is.a.Function();
    });

  });

  describe('getMessage', function () {

    it('should return string error message', function () {
      let error = { message: 'The request is invalid' };

      let interpreter = new ErrorInterpreter(error);
      let message = interpreter.getMessage();

      message.should.eql(error.message);
    });

    it('should return error message from function', function () {
      let messageToReturn = 'The request is invalid';
      let error = { message: () => messageToReturn };
      let parameters = { details: ', because it is not valid' };

      let interpreter = new ErrorInterpreter(error, parameters);
      let message = interpreter.getMessage();

      message.should.eql(messageToReturn);
    });

    it('should pass params to error message function', function () {
      let baseMessage = 'The request is invalid';
      let error = {
        message: (parameters) => {
          return baseMessage + parameters.details;
        }
      };
      let parameters = { details: ', because it is not valid' };

      let interpreter = new ErrorInterpreter(error, parameters);
      let message = interpreter.getMessage();

      message.should.eql(baseMessage + parameters.details);
    });

    it('should return nothing if no error message was given', function () {
      let error = {};

      let interpreter = new ErrorInterpreter(error);
      let message = interpreter.getMessage();

      should.not.exist(message);
    });

    it('should throw an error if the error message is not a string', function () {
      let error = { message: {} };

      let interpreter = new ErrorInterpreter(error);
      (() => interpreter.getMessage())
        .should.throw(`Invalid error message "${{}}". It must be a string`);
    });

  });

  describe('getStatusCode', function () {

    it('should return valid number HTTP status code', function () {
      let error = { statusCode: 404 };

      let interpreter = new ErrorInterpreter(error);
      let statusCode = interpreter.getStatusCode();

      statusCode.should.eql(404);
    });

    it('should return HTTP status code from function', function () {
      let error = { statusCode: () => 404 };

      let interpreter = new ErrorInterpreter(error);
      let statusCode = interpreter.getStatusCode();

      statusCode.should.eql(404);
    });

    it('should pass params to HTTP status code function', function () {
      let error = {
        statusCode: (parameters) => parameters.actualstatusCode
      };
      let parameters = { actualstatusCode: 502 };

      let interpreter = new ErrorInterpreter(error, parameters);
      let statusCode = interpreter.getStatusCode();

      statusCode.should.eql(502);
    });

    it('should return 500 if no HTTP status code was given', function () {
      let error = {};

      let interpreter = new ErrorInterpreter(error);
      let statusCode = interpreter.getStatusCode();

      statusCode.should.eql(500);
    });

    it('should throw an error if the HTTP status code is not valid', function () {
      let error = { statusCode: 999 };

      let interpreter = new ErrorInterpreter(error);
      (() => interpreter.getStatusCode())
        .should.throw(`Invalid HTTP status code ${error.statusCode}`);
    });

  });

});
