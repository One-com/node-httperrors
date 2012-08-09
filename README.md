node-httperrors
===============

Exposes HTTP 4xx and 5xx status codes as JavaScript Error objects.

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install httperrors

Usage
-----

    var httpErrors = require('httperrors');

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

Creating your own Error classes:

    var httpErrors = require('httperrors');

    var MyError = httpErrors.createError({
        name: 'MyError',
        // Used when no message is handed to the constructor:
        message: 'A slightly longer description of the error'
    });

Instances can carry extra data about the error:

    try {
        throw new httpErrors.Forbidden({
            message: "The message", // Not mandatory
            data: {disallowedIds: [1, 3, 4, 6]}
        });
    } catch(e) {
        console.warn(e.data); // {disallowedIds: [1, 3, 4, 6]}
    }

Inheriting from an existing Error class:

    var httpErrors = require('httperrors');

    var NotFoundUnderTheBedError = httpErrors.createError({
        name: 'NotFoundUnderTheBed',
        message: 'I looked under the bed, but it was not found'
    }, httpErrors.NotFound);

Instances of this error walk and quack like `httpErrors.NotFound` instances, of course:

    var ohDear = new NotFoundUnderTheBedError('No monsters today');
    console.warn(ohDear.NotFound); // true
    console.warn(ohDear.NotFoundUnderTheBed); // true


License
-------

3-clause BSD license -- see the `LICENSE` file for details.
