'use strict';
/* global describe, it */

const express = require('express');
const request = require('supertest');
const should = require('should');

const index = require('../../index');

describe('index', function () {

  it('should return an Express error middleware function', function () {
    let errorMiddleware = index();

    should.exist(errorMiddleware);
    errorMiddleware.should.be.of.type('function');
    errorMiddleware.should.have.length(4);
  });

  it('should accept error definitions as a parameter', function () {
    let errors = {
      STRANGE_REQUEST: {
        statusCode: 400,
        message: 'The request is strange'
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
      .expect(errors.STRANGE_REQUEST.statusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'STRANGE_REQUEST',
        message: errors.STRANGE_REQUEST.message
      });
  });

  it('should throw an error if the supplied error definitions is not an object', function () {
    let errors = 'NOT_AN_OBJECT';

    (() => index(errors))
      .should.throw('Error definition must be an object');
  });

});
