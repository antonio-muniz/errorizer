'use strict';
/* global describe,it */

const express = require('express');
const request = require('supertest');
const should = require('should');

const constants = require('../../../lib/constants');
const ErrorMiddlewareFactory = require('../../../lib/error-middleware-factory');

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

describe('ErrorMiddlewareFactory', function () {

  describe('create', function () {

    it('should return an Express error middleware for the error definitions', function () {
      let errorMiddleware = ErrorMiddlewareFactory.create(errors);

      should.exist(errorMiddleware);
      errorMiddleware.should.be.a.Function();
      errorMiddleware.should.have.length(4);
    });

  });

  describe('middleware', function () {

    it('should translate and respond an error', function () {
      let app = express();

      let code = 'INVALID_REQUEST';
      let expectedError = errors[code];

      app.get('/', (req, res, next) => next(code));
      app.use(ErrorMiddlewareFactory.create(errors));

      return request(app)
        .get('/')
        .expect(expectedError.status)
        .expect('Content-Type', /json/)
        .expect({
          status: constants.STATUS_CODES[expectedError.status],
          code,
          message: expectedError.message,
          detail: expectedError.detail
        });
    });

    it('should respond the default error if a translation error occurs', function () {
      let app = express();

      let code = 'BUGGED_ERROR';
      let expectedError = constants.DEFAULT_ERROR;

      app.get('/', (req, res, next) => next(code));
      app.use(ErrorMiddlewareFactory.create(errors));

      return request(app)
        .get('/')
        .expect(expectedError.status)
        .expect('Content-Type', /json/)
        .expect({
          status: constants.STATUS_CODES[expectedError.status],
          code: constants.DEFAULT_ERROR_CODE,
          message: expectedError.message
        });
    });

    it('should forward the error if a response has already been sent', function () {
      let app = express();

      let code = 'INVALID_REQUEST';

      app.get('/', (req, res, next) => {
        res.end();
        return next(code);
      });
      app.use(ErrorMiddlewareFactory.create(errors));

      let forwardedError;
      app.use((err, req, res, next) => {
        forwardedError = err;
      });

      return request(app)
        .get('/')
        .expect(200)
        .then(() => {
          should.exist(forwardedError);
          forwardedError.should.eql(code);
        });
    });

  });

});
