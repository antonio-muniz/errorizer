'use strict';
/* global describe,it */

require('should');

const ErrorizerError = require('../../../../lib/utils/errorizer-error');

describe('ErrorizerError', function () {

  describe('constructor', function () {

    it('should create an error tagged with "[errorizer]"', function () {
      let message = 'An error has occurred';
      let error = new ErrorizerError(message);

      error.should.be.instanceOf(ErrorizerError);
      error.should.be.instanceOf(Error);
      error.should.have.property('name', ErrorizerError.name);
      error.should.have.property('message', `[errorizer] ${message}`);
      error.should.have.property('stack').which.is.a.String().and.startWith(error.name);
    });

  });

});
