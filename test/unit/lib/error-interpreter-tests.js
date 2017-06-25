'use strict';
/* global describe, it */

const should = require('should');

const ErrorInterpreter = require('../../../lib/error-interpreter');

describe('ErrorInterpreter', function () {

  describe('constructor', function () {

    it('should create an error interpreter for an error', function () {
      let error = { status: 400, message: 'The request is invalid' };
      let params = { prop: 'value' };

      let interpreter = new ErrorInterpreter(error, params);

      should.exist(interpreter);
      interpreter.should.be.instanceof(ErrorInterpreter);
      interpreter.should.have.property('error').which.is.eql(error);
      interpreter.should.have.property('params').which.is.eql(params);
      interpreter.should.have.property('getMessage').which.is.a.Function();
      interpreter.should.have.property('getStatus').which.is.a.Function();
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
      let params = { details: ', because it is not valid' };

      let interpreter = new ErrorInterpreter(error, params);
      let message = interpreter.getMessage();

      message.should.eql(messageToReturn);
    });

    it('should pass params to error message function', function () {
      let baseMessage = 'The request is invalid';
      let error = {
        message: (params) => {
          return baseMessage + params.details;
        }
      };
      let params = { details: ', because it is not valid' };

      let interpreter = new ErrorInterpreter(error, params);
      let message = interpreter.getMessage();

      message.should.eql(baseMessage + params.details);
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

  describe('getStatus', function () {

    it('should return valid number HTTP status code', function () {
      let error = { status: 404 };

      let interpreter = new ErrorInterpreter(error);
      let status = interpreter.getStatus();

      status.should.eql(404);
    });

    it('should return HTTP status code from function', function () {
      let error = { status: () => 404 };

      let interpreter = new ErrorInterpreter(error);
      let status = interpreter.getStatus();

      status.should.eql(404);
    });

    it('should pass params to HTTP status code function', function () {
      let error = {
        status: (params) => params.actualstatus
      };
      let params = { actualstatus: 502 };

      let interpreter = new ErrorInterpreter(error, params);
      let status = interpreter.getStatus();

      status.should.eql(502);
    });

    it('should return 500 if no HTTP status code was given', function () {
      let error = {};

      let interpreter = new ErrorInterpreter(error);
      let status = interpreter.getStatus();

      status.should.eql(500);
    });

    it('should throw an error if the HTTP status code is not valid', function () {
      let error = { status: 999 };

      let interpreter = new ErrorInterpreter(error);
      (() => interpreter.getStatus())
        .should.throw(`Invalid HTTP status code ${error.status}`);
    });

  });

});
