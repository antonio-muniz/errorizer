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

      let code, params;

      if (util.isString(err)) {
        code = err;
      }
      else if (util.isObject(err)) {
        code = err.code;
        params = err.params;
      }
      else {
        code = DEFAULT_ERROR_CODE;
      }

      code = (util.isUndefined(errors[code]))
        ? DEFAULT_ERROR_CODE
        : code;

      let error = errors[code];

      let interpreter = new ErrorInterpreter(error, params);
      let status, message;

      try {
        status = interpreter.getStatus();
        message = interpreter.getMessage();
      }
      catch (interpreterError) {
        code = DEFAULT_ERROR_CODE;
        status = DEFAULT_ERROR.status;
        message = DEFAULT_ERROR.message;
      }

      res.status(status).json({
        code,
        message
      });

      return next();
    };
  }

}

module.exports = ErrorMiddlewareFactory;
