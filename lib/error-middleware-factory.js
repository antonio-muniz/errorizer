'use strict';

const constants = require('./constants');
const ErrorTranslator = require('./translator/error-translator');

class ErrorMiddlewareFactory {

  static create(errors) {
    let translator = new ErrorTranslator(errors);

    return (err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      let errorResponse;

      try {
        errorResponse = translator.translate(err);
      }
      catch (translationError) {
        errorResponse = translator.translate(constants.DEFAULT_ERROR_CODE);
      }

      res.status(errorResponse.status).json({
        status: constants.STATUS_CODES[errorResponse.status],
        code: errorResponse.code,
        message: errorResponse.message,
        detail: errorResponse.detail
      });

      return next();
    };
  }

}

module.exports = ErrorMiddlewareFactory;
