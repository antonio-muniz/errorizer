'use strict';

const util = require('util');

const ErrorInterpreter = require('./error-interpreter');
const { DEFAULT_ERROR_CODE, DEFAULT_ERROR } = require('./constants');

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
      let httpStatusCode, errorMessage;

      try {
        httpStatusCode = interpreter.getHttpStatusCode();
        errorMessage = interpreter.getErrorMessage();
      }
      catch (interpreterError) {
        errorCode = DEFAULT_ERROR_CODE;
        ({ httpStatusCode, errorMessage } = DEFAULT_ERROR);
      }

      res.status(httpStatusCode).json({
        errorCode,
        errorMessage
      });

      return next();
    };
  }

}

module.exports = ErrorMiddlewareFactory;
