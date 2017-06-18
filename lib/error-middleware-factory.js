'use strict';

const util = require('util');

const ErrorInterpreter = require('./error-interpreter');

const constants = require('./constants');
const DEFAULT_ERROR_CODE = constants.DEFAULT_ERROR_CODE;
const DEFAULT_ERROR = constants.DEFAULT_ERROR;

class ErrorMiddlewareFactory {

  static create(errors) {
    errors[DEFAULT_ERROR_CODE] = DEFAULT_ERROR;

    return (err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      let errorCode, parameters;

      if (util.isString(err)) {
        errorCode = err;
      }
      else if (util.isObject(err)) {
        errorCode = err.code;
        parameters = err.params;
      }
      else {
        errorCode = DEFAULT_ERROR_CODE;
      }

      errorCode = (util.isUndefined(errors[errorCode]))
        ? DEFAULT_ERROR_CODE
        : errorCode;

      let error = errors[errorCode];

      let interpreter = new ErrorInterpreter(error, parameters);
      let statusCode, message;

      try {
        statusCode = interpreter.getstatusCode();
        message = interpreter.getmessage();
      }
      catch (interpreterError) {
        statusCode = DEFAULT_ERROR.statusCode;
        errorCode = DEFAULT_ERROR_CODE;
        message = DEFAULT_ERROR.message;
      }

      res.status(statusCode).json({
        errorCode,
        message
      });

      return next();
    };
  }

}

module.exports = ErrorMiddlewareFactory;
