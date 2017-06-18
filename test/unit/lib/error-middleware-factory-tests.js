'use strict';
/* global describe,it */

const express = require('express');
const request = require('supertest');
const should = require('should');

const ErrorMiddlewareFactory = require('../../../lib/error-middleware-factory');

const constants = require('../../../lib/constants');
const DEFAULT_ERROR_CODE = constants.DEFAULT_ERROR_CODE;
const DEFAULT_ERROR = constants.DEFAULT_ERROR;

describe('ErrorMiddlewareFactory', function () {

  it('should be an Express error middleware function', function () {
    let errors = {};
    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    errorMiddleware.should.be.of.type('function');
    errorMiddleware.should.have.length(4);
  });

  it('should handle known errors as object', function () {
    let errors = {
      STRANGE_REQUEST: {
        httpStatusCode: 400,
        errorMessage: 'The request is strange'
      }
    };

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      next({ code: 'STRANGE_REQUEST' });
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(errors.STRANGE_REQUEST.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'STRANGE_REQUEST',
        errorMessage: errors.STRANGE_REQUEST.errorMessage
      });
  });

  it('should handle known errors as string', function () {
    let errors = {
      STRANGE_REQUEST: {
        httpStatusCode: 400,
        errorMessage: 'The request is strange'
      }
    };

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      next('STRANGE_REQUEST');
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(errors.STRANGE_REQUEST.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'STRANGE_REQUEST',
        errorMessage: errors.STRANGE_REQUEST.errorMessage
      });
  });

  it('should handle unknown errors by sending the default error', function () {
    let errors = {};

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      next({ code: 'STRANGE_REQUEST' });
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(DEFAULT_ERROR.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: DEFAULT_ERROR.errorMessage
      });
  });

  it('should handle unidentified errors by sending the default error', function () {
    let errors = {};

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      next(new Error('BOOM!'));
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(DEFAULT_ERROR.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: DEFAULT_ERROR.errorMessage
      });
  });

  it('should handle invalid errors by sending the default error', function () {
    let errors = {};

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      next(404);
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(DEFAULT_ERROR.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: DEFAULT_ERROR.errorMessage
      });
  });

  it('should not handle the error if the response has already been sent', function () {
    let errors = {};

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      res.end();
      next({ code: 'STRANGE_REQUEST' });
    });
    app.use(errorMiddleware);

    let uncaughtError;
    app.use((err, req, res, next) => {
      uncaughtError = err;
      next();
    });

    return request(app)
      .get('/')
      .expect(200)
      .then(() => {
        should.exist(uncaughtError);
        uncaughtError.should.eql({ code: 'STRANGE_REQUEST' });
      });
  });

  it('should send the default error if an error is thrown in the error interpreter', function () {
    let errors = {
      TROUBLESOME_ERROR: {
        httpStatusCode: 'this shall make the interpreter explode'
      }
    };

    let errorMiddleware = ErrorMiddlewareFactory.create(errors);

    let app = express();
    app.get('/', (req, res, next) => {
      next({ code: 'TROUBLESOME_ERROR' });
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(DEFAULT_ERROR.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: DEFAULT_ERROR.errorMessage
      });
  });

});
