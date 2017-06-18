'use strict';

const errorizer = require('../');
const express = require('express');

let app = express();

app.get('/errors/string', (req, res, next) => {
  next('ERROR_AS_STRING');
});

app.get('/errors/object', (req, res, next) => {
  next({ code: 'ERROR_AS_OBJECT' });
});

app.get('/errors/params', (req, res, next) => {
  next({
    code: 'ERROR_WITH_PARAMS',
    params: {
      statusCode: 402,
      message: 'This error message is from the parameters'
    }
  });
});

app.get('/errors/error', (req, res, next) => {
  next('ERROR_WITH_ERROR');
});

app.get('/errors/unexpected', (req, res, next) => {
  next(new Error('BOOM!'));
});

let errorMiddleware = errorizer({
  ERROR_AS_STRING: {
    statusCode: 400,
    message: 'This error was used as a string'
  },
  ERROR_AS_OBJECT: {
    statusCode: 401,
    message: 'This error was used as an object'
  },
  ERROR_WITH_PARAMS: {
    statusCode: parameters => parameters.statusCode,
    message: parameters => parameters.message
  },
  ERROR_WITH_ERROR: {
    statusCode: parameters => 'UGLY BUG!',
    message: 'This error will cause an error'
  }
});

app.use(errorMiddleware);

const port = 32202;
app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
