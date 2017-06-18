'use strict';
/* global describe, it, before, after */

const fs = require('fs');
const express = require('express');
const request = require('supertest');
const path = require('path');
const should = require('should');

const index = require('../../index');

const ERRORS_FILE = require('../../lib/constants').ERRORS_FILE;

describe('index', function () {

  before(function () {
    let errorsFilePath = path.join(process.cwd(), ERRORS_FILE);
    fs.writeFileSync(errorsFilePath, `
      'use strict';
      
      module.exports = {
        STRANGE_REQUEST: {
          httpStatusCode: 400,
          errorMessage: "The request is strange"
        }
      };`);
  });

  it('should return an Express error middleware function', function () {
    let errorMiddleware = index();

    should.exist(errorMiddleware);
    errorMiddleware.should.be.of.type('function');
    errorMiddleware.should.have.length(4);
  });

  it('should accept error definitions as a parameter', function () {
    let errors = {
      STRANGE_REQUEST: {
        httpStatusCode: 400,
        errorMessage: 'The request is strange'
      }
    };

    let errorMiddleware = index(errors);

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

  it('should fallback to the error definitions file', function () {
    let errorMiddleware = index();

    let app = express();
    app.get('/', (req, res, next) => {
      next('STRANGE_REQUEST');
    });
    app.use(errorMiddleware);

    return request(app)
      .get('/')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'STRANGE_REQUEST',
        errorMessage: 'The request is strange'
      });
  });

  it('should throw an error if the supplied error definitions is not an object', function () {
    let errors = 'NOT_AN_OBJECT';

    (() => index(errors))
      .should.throw('Error definition must be an object');
  });

  after(function () {
    let errorsFilePath = path.join(process.cwd(), ERRORS_FILE);
    fs.unlinkSync(errorsFilePath);
  });

});
