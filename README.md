node-httperrors
===============

Exposes HTTP 4xx and 5xx status codes as JavaScript Error objects. The error classes are created using the <a href="https://github.com/One-com/node-createerror">createError module</a>.

The original use case for `httpErrors` is to use a custom <a href="https://github.com/visionmedia/express">express</a> error handler that uses the `statusCode` property of the error instance as the status code for the response, and optionally logs further info from the error.


Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install httperrors

Usage
-----

    var httpErrors = require('httperrors');

    // Instatiate by status code:
    var myError = httpErrors(412);

    // Instantiate by name (UpperCamelCase):
    var err = new httpErrors.NotFound('The thing you were looking for was not found');

    console.warn(err.toString()); // NotFound [404]: The thing you were looking for was not found

    if (identityCrisis) {
        throw new httpErrors.ImATeapot('Dude...');
    }

The CamelCased error name is exposed as a true property on the
instances, so your error handling code becomes quite readable (and you
can avoid using instanceof):

    if (err.NotFound) {
        // ...
    } else if (err.BadGateway) {
        // ...
    }

You can also create an error by status code (useful when proxying):

    function fetchSomething(cb) {
        var request = require('request');
        request('http://example.com/thething', function (err, response) {
            if (err) {
                return cb(new (httpErrors[response.statusCode] || httpErrors.BadGateway)());
            }
            // ...
        });
    }

License
-------

3-clause BSD license -- see the `LICENSE` file for details.
