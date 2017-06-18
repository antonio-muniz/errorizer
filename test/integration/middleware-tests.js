'use strict';
/* global describe, it, before, after */

const { spawn } = require('child_process');
const request = require('supertest');

const app = 'http://127.0.0.1:32202';
const { DEFAULT_ERROR_CODE, DEFAULT_ERROR } = require('../../lib/constants');

describe('errorizer middleware', function () {

  let sampleAppProcess;

  before(function (done) {
    console.log('Starting sample app in background...');
    sampleAppProcess = spawn('node', ['./sample/app']);
    setTimeout(() => {
      console.log('Sample app started!');
      done();
    }, 3000);
  });

  it('should return errors handled as strings', function () {
    return request(app)
      .get('/errors/string')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'ERROR_AS_STRING',
        errorMessage: 'This error was used as a string'
      });
  });

  it('should return errors handled as objects', function () {
    return request(app)
      .get('/errors/object')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'ERROR_AS_OBJECT',
        errorMessage: 'This error was used as an object'
      });
  });

  it('should return errors handled with parameters', function () {
    return request(app)
      .get('/errors/params')
      .expect(402)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: 'ERROR_WITH_PARAMS',
        errorMessage: 'This error message is from the parameters'
      });
  });

  it('should return the default error if a custom error function has issues', function () {
    return request(app)
      .get('/errors/error')
      .expect(DEFAULT_ERROR.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: DEFAULT_ERROR.errorMessage
      });
  });

  it('should return the default error if an unexpected error occurs', function () {
    return request(app)
      .get('/errors/unexpected')
      .expect(DEFAULT_ERROR.httpStatusCode)
      .expect('Content-Type', /json/)
      .expect({
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: DEFAULT_ERROR.errorMessage
      });
  });

  after(function () {
    sampleAppProcess.kill();
  });

});
