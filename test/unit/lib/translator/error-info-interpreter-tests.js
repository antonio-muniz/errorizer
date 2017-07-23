'use strict';
/* global describe,it */

const should = require('should');

const constants = require('../../../../lib/constants');
const ErrorInfoInterpreter = require('../../../../lib/translator/error-info-interpreter');

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

describe('ErrorInfoInterpreter', function () {

  describe('constructor', function () {

    it('should create an error interpreter for the error definitions', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      interpreter.should.be.instanceOf(ErrorInfoInterpreter);
      interpreter.should.have.property('errors', errors);
      interpreter.should.have.property('interpret').which.is.a.Function();
    });

  });

  describe('interpret', function () {

    it('should interpret an error thrown as a string', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      let code = 'INVALID_REQUEST';

      let errorInfo = interpreter.interpret(code);

      should.exist(errorInfo);
      Object.keys(errorInfo).should.have.length(2);
      errorInfo.should.have.property('code', code);
      errorInfo.should.have.property('properties').which.is.Undefined();
    });

    it('should interpret an error thrown as an error', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      let code = 'INVALID_REQUEST';

      let errorInfo = interpreter.interpret(new Error(code));

      should.exist(errorInfo);
      Object.keys(errorInfo).should.have.length(2);
      errorInfo.should.have.property('code', code);
      errorInfo.should.have.property('properties').which.is.Undefined();
    });

    it('should interpret an error thrown as an object', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      let code = 'INVALID_REQUEST';

      let errorInfo = interpreter.interpret({ code });

      should.exist(errorInfo);
      Object.keys(errorInfo).should.have.length(2);
      errorInfo.should.have.property('code', code);
      errorInfo.should.have.property('properties').which.is.Undefined();
    });

    it('should interpret an error thrown as an object with custom properties', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      let code = 'INVALID_REQUEST';
      let properties = { custom: 'anything' };

      let errorInfo = interpreter.interpret({ code, properties });

      should.exist(errorInfo);
      Object.keys(errorInfo).should.have.length(2);
      errorInfo.should.have.property('code', code);
      errorInfo.should.have.property('properties', properties);
    });

    it('should return the default error code for invalid types', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      let errorInfo = interpreter.interpret(false);

      should.exist(errorInfo);
      Object.keys(errorInfo).should.have.length(2);
      errorInfo.should.have.property('code', constants.DEFAULT_ERROR_CODE);
      errorInfo.should.have.property('properties').which.is.Undefined();
    });

    it('should return the default error code for unknown errors', function () {
      let interpreter = new ErrorInfoInterpreter(errors);

      let errorInfo = interpreter.interpret({ code: 'UNKNOWN_ERROR' });

      should.exist(errorInfo);
      Object.keys(errorInfo).should.have.length(2);
      errorInfo.should.have.property('code', constants.DEFAULT_ERROR_CODE);
      errorInfo.should.have.property('properties').which.is.Undefined();
    });

  });

});
