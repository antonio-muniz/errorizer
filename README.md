# errorizer
[![Build Status](https://travis-ci.org/antonio-muniz/errorizer.svg?branch=master)](https://travis-ci.org/antonio-muniz/errorizer)

An Express middleware for organizing and returning custom errors in JSON APIs.

By using this library, you can:
- declare your API errors in a single place, and use them wherever you need;
- respond with error by simply calling the `next` function;
- use meaningful, one-line errors in your code, without having HTTP response logic for errors everywhere.

## Usage

```js
/* CREATING AN APP */

const express = require('express');
const errorizer = require('errorizer');

let app = express();

// your routes and middlewares here

// create an errorizer middleware with your errors and add it to the app
app.use(errorizer({
  STRANGE_REQUEST: {
    status: 400,
    message: 'The request is really strange'
  },
  SERVER_EXPLODED: {
    status: 500,
    message: 'Boom!'
  }
}));
```

```js

// responding errors
app.post('/something', (req, res, next) => {
  if (isStrange(req)) {
    return next('STRANGE_REQUEST');
  }
  // do something
});

// response
HTTP 400
Content-Type: "application/json; charset=utf-8"
{
  "status": "Bad Request",
  "code": "STRANGE_REQUEST",
  "message": "The request is really strange"
}
```

## Error definitions

The API errors must be declared in an object and passed as a parameter to the main function, which creates the middleware.

```js
let errors = {}; // your error definitions
let errorMiddleware = errorizer(errors);
app.use(errorMiddleware);
```

The `errors` object must contain error codes as keys. The error codes will identify the code in your app and should also be used by clients to identify errors, so they shouldn't be changed unless breaking is intended.

The value of the `errors` object must be a function that returns an error object, or just the error object itself. The error object may have these properties:

* **`status`** (number, required): the HTTP status code for the error.
* **`message`** (string, required): a brief description of the error.
* **`detail`** (string/object/array, optional): a property for adding more details to the error, like a longer description, a link to the documentation, etc.

If the error is declared as a function, you can customize the error on every occurrence of it.

### Example

```js
let errors = {

  // declared as a static object
  USER_NOT_FOUND: {
    status: 404,
    message: 'The specified user could not be found',
    detail: {
      description: 'This error occurs when the requested user does not exist',
      docs: 'http://docs.myapp.com/v1/errors/USER_NOT_FOUND'
    }
  },

  // declared as a function for customization
  INVALID_DATE: function(err) {
    return {
      status: 400,
      message: `'${err.properties.date}' is not a valid date`,
      detail: {
        format: err.properties.format,
        docs: `http://docs.myapp.com/v1/errors/${err.code}`
      }
    }
  }

}
```

## Error responses

When an error condition is met somewhere in the code, the only thing that needs to be done is passing the error code to Express' `next` function.

For convenience, you can specify the code as a string or as the message of an instance of `Error`.

You can also include the error code in the `code` property of an object. This is useful for customizing an error defined with a function because, in addition to the error code, you can also include `properties` that can be used by your error function.

```js
// plain string
next('USER_NOT_FOUND');

// message of Error instance
next(new Error('USER_NOT_FOUND'));

// using an object
next({ code: 'USER_NOT_FOUND' });

// response for either of the above
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

```js
// using an object with "properties"
next({
  code: 'INVALID_DATE',
  properties: {
    date: '07/24/2017',
    format: 'YYYY-MM-dd'
  }
});

// response
HTTP 400
Content-Type: "application/json; charset=utf-8"
{
  "status": "Bad Request",
  "code": "INVALID_DATE",
  "message": "'07/24/2017' is not a valid date",
  "detail": {
    "format": "YYYY-MM-dd",
    "docs": "http://docs.myapp.com/v1/errors/INVALID_DATE"
  }
}
```

## Contributing

Feel free to open issues or fork this repository.
Before opening a pull request, make sure to have tests for your changes.

## License

MIT
