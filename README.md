# errorizer
[![Build Status](https://travis-ci.org/antonio-muniz/errorizer.svg?branch=master)](https://travis-ci.org/antonio-muniz/errorizer)

An Express middleware for organizing and returning custom errors in JSON APIs.

By using this library, you can:
- declare your API errors in a single place, and use them wherever you need;
- exit with error by simply calling the `next` function;
- use meaningful, one-line errors in your code, without having HTTP response logic for errors everywhere.

## Usage

```js
/* CREATING AN APP */

const express = require('express');
const errorizer = require('errorizer');

let app = express();

// your handlers and middlewares here

// create an errorizer middleware with your errors and add it to the app
app.use(errorizer({
  STRANGE_REQUEST: {
    statusCode: 400,
    message: 'The request is really strange'
  },
  SERVER_EXPLODED: {
    statusCode: 500,
    message: 'Boom!'
  }
}));
```

```js
/* RESPONDING ERRORS */

app.post('/doSomething', (req, res, next) => {
  if (isStrange(req)) {
    return next('STRANGE_REQUEST');
  }
  // do something
});

/* RESPONSE */
HTTP 400 (Bad Request)
Content-Type: "application/json; charset=utf-8"
{
  "errorCode": "STRANGE_REQUEST",
  "message": "The request is really strange"
}
```
