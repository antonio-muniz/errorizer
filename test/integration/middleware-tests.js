'use strict';
/* global describe, it, before, after */

const spawn = require('child_process').spawn;
const request = require('supertest');

const app = 'http://127.0.0.1:32202';

const constants = require('../../lib/constants');
const DEFAULT_ERROR_CODE = constants.DEFAULT_ERROR_CODE;
const DEFAULT_ERROR = constants.DEFAULT_ERROR;

describe('errorizer middleware', function () {

  let testAppProcess;

  before(function (done) {
    console.log('Starting test app in background...');
    testAppProcess = spawn('node', ['./test-app/app']);
    setTimeout(() => {
      console.log('Test app started!');
      done();
    }, 3000);
  });

  it('should return errors handled as strings', function () {
    return request(app)
      .get('/errors/string')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({
        code: 'ERROR_AS_STRING',
        message: 'This error was used as a string'
      });
  });

  it('should return errors handled as objects', function () {
    return request(app)
      .get('/errors/object')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect({
        code: 'ERROR_AS_OBJECT',
        message: 'This error was used as an object'
      });
  });

  it('should return errors handled with parameters', function () {
    return request(app)
      .get('/errors/params')
      .expect(402)
      .expect('Content-Type', /json/)
      .expect({
        code: 'ERROR_WITH_PARAMS',
        message: 'This error message is from the parameters'
      });
  });

  it('should return the default error if a custom error function has issues', function () {
    return request(app)
      .get('/errors/error')
      .expect(DEFAULT_ERROR.status)
      .expect('Content-Type', /json/)
      .expect({
        code: DEFAULT_ERROR_CODE,
        message: DEFAULT_ERROR.message
      });
  });

  it('should return the default error if an unexpected error occurs', function () {
    return request(app)
      .get('/errors/unexpected')
      .expect(DEFAULT_ERROR.status)
      .expect('Content-Type', /json/)
      .expect({
        code: DEFAULT_ERROR_CODE,
        message: DEFAULT_ERROR.message
      });
  });

  after(function () {
    testAppProcess.kill('SIGKILL');
  });

});
