# errorizer
[![Travis](https://img.shields.io/travis/antonio-muniz/errorizer.svg)](https://travis-ci.org/antonio-muniz/errorizer)
[![Coveralls](https://img.shields.io/coveralls/antonio-muniz/errorizer.svg)](https://coveralls.io/github/antonio-muniz/errorizer)
[![npm](https://img.shields.io/npm/v/errorizer.svg)](https://www.npmjs.com/package/errorizer)
[![license](https://img.shields.io/github/license/antonio-muniz/errorizer.svg)](https://github.com/antonio-muniz/errorizer/blob/master/LICENSE)

An [Express error middleware](http://expressjs.com/en/guide/error-handling.html) for organizing and returning custom errors in JSON APIs.

Without appending functions to Express objects, this package lets you:
- return useful, standardized error responses to your clients;
- declare API errors once, use them anywhere;
- respond errors with ease, using only meaningful error codes;

## Table of contents
* [Requirements](#requirements)
* [Usage](#usage)
* [Defining errors](#defining-errors)
* [Responding errors](#responding-errors)
* [Customizing errors with templates](#customizing-errors-with-templates)
* [Unexpected errors](#unexpected-errors)
* [Contributing](#contributing)
* [License](#license)

----

## Requirements
- Node.js v4+
- [Express](https://github.com/expressjs/express) v4+

## Usage

```js
const express = require('express');
const errorizer = require('errorizer');

let app = express();

app.post('/users', (req, res, next) => {
  if (!isEmail(req.body.email)) {
    return next('INVALID_EMAIL');
  }
  if (emailExists(req.body.email)) {
    return next('EMAIL_ALREADY_EXISTS');
  }
  // ...
});

app.use(errorizer({
  INVALID_EMAIL: {
    status: 400,
    message: 'The email is not in a valid format'
  },
  EMAIL_ALREADY_EXISTS: {
    status: 400,
    message: 'The specified email already belongs to another user'
  }
}));

app.listen(3000);
```

```js
// Response example

HTTP 400
Content-Type: "application/json; charset=utf-8"
{
  "status": "Bad Request",
  "code": "INVALID_EMAIL",
  "message": "The email is not in a valid format"
}
```

## Defining errors

The API errors must be declared in an object and passed as a parameter to the main function.

```js
let errors = { /* ... */ };
let errorMiddleware = errorizer(errors);
app.use(errorMiddleware);
```

The `errors` object must contain error codes as keys. The error codes will identify the error in your app and should also be used by clients.

As shown in the examples, each error may have these properties:

* **`status`** (number, required): the HTTP status code for the error.
* **`message`** (string, required): a brief description of the error.
* **`detail`** (string/object/array, optional): a property for adding more details (e.g.: a longer description, a link to the documentation, etc.)

**PROTIP**: Declare your errors in a separate file (e.g.: `errors.js`) to keep your application startup file clean.

### Example

```js
// errors.js

module.exports = {

  INVALID_EMAIL: {
    status: 400,
    message: 'The email is not in a valid format'
  },

  EMAIL_ALREADY_EXISTS: {
    status: 400,
    message: 'The specified email already belongs to another user'
  },

  USER_NOT_FOUND: {
    status: 404,
    message: 'Could not find a user with the specified ID'
  },

  INVALID_LOGIN_OR_PASSWORD: {
    status: 401,
    message: 'The login and/or password are incorrect'
  }

};
```

## Responding errors

When an error condition is met somewhere in the code, all that needs to be done is to make the error code reach Express' `next` function.

For convenience, you can specify the error code in multiple ways:
- as a string;
- within an instance of `Error`;
- in the `code` property of an object

### Example
```js
errorizer({
  USER_NOT_FOUND: {
    status: 404,
    message: 'The specified user could not be found',
    detail: {
      description: 'This error occurs when the requested user does not exist',
      docs: 'http://docs.myapp.com/v1/errors/USER_NOT_FOUND'
    }
  }
});

// different ways to respond an error
function(req,res,next) => {
  // plain string
  next('USER_NOT_FOUND');

  // Error instance
  next(new Error('USER_NOT_FOUND'));

  // "code" property in object
  next({ code: 'USER_NOT_FOUND' });
}

// response sent for any of the above
HTTP 404
Content-Type: "application/json; charset=utf-8"
{
  "status": "Not Found",
  "code": "USER_NOT_FOUND",
  "message": "The specified user could not be found",
  "detail": {
    "description": "This error occurs when the requested user does not exist",
    "docs": "http://docs.myapp.com/v1/errors/USER_NOT_FOUND"
  }
}
```

## Customizing errors with templates

Sometimes, you need an error response to contain values which may vary on every occurrence of it.

For example, a form validation response with information about all fields with invalid values for UI highlighting.
```js
HTTP 400
Content-Type: "application/json; charset=utf-8"
{
  "status": "Bad Request",
  "code": "FORM_VALIDATION_ERROR",
  "message": "Some form fields contain invalid values",
  "detail": [
    {
      "field": "email",
      "message": "The email is required"
    },
    {
      "field": "password",
      "message": "The password is required"
    }
  ]
}
```

Or an error response containing data from the request.
```js
HTTP 400
Content-Type: "application/json; charset=utf-8"
{
  "status": "Bad Request",
  "code": "INVALID_DATE",
  "message": "07/24/2017 is not a valid date",
  "detail": {
    "format": "YYYY-MM-dd",
    "docs": "http://docs.myapp.com/v1/errors/INVALID_DATE"
  }
}
```

You achieve this by declaring error templates and using the `custom` property!

Instead of declaring `FORM_VALIDATION_ERROR` and `INVALID_DATE` as static error objects, you can declare them as functions that return error objects (templates).

```js
// errors.js

module.exports = {

  FORM_VALIDATION_ERROR: function(err) {
    return {
      status: 400,
      message: 'Some form fields contain invalid values',
      detail: err.custom
    }
  },

  INVALID_DATE: function(err) {
    return {
      status: 400,
      message: err.custom.date + ' is not a valid date',
      detail: {
        format: err.custom.format,
        docs: "http://docs.myapp.com/v1/errors/INVALID_DATE"
      }
    }
  }

};
```

Then, your route handlers can customize the errors by sending data in the `custom` property.
```js
function(req, res, next) => {
  let formErrors = validateForm(req);
  if (formErrors.length > 0) {
    return next({
      code: 'FORM_VALIDATION_ERROR',
      custom: formErrors
    });
  }
};

function(req, res, next) => {
  const dateFormat = 'YYYY-mm-dd';
  if (!dateFormatIsCorrect(req.body.date, dateFormat)) {
    return next({
      code: 'INVALID_DATE',
      custom: {
        date: req.body.date,
        format: dateFormat
      }
    });
  }
};
```

## Unexpected errors

If there's a bug in the code and an error is thrown out of nowhere, the error middleware will take care of it and generate the error below:

```js
HTTP 500
Content-Type: "application/json; charset=utf-8"
{
  "status": "Internal Server Error",
  "code": "UNEXPECTED_ERROR",
  "message": "An unexpected error has occurred while fulfilling the request"
}
```

## Contributing

Feel free to contribute. All feedback is welcome!

Before opening a pull request, make sure to have your changes covered by tests.


## License

MIT
