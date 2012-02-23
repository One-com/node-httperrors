node-httperrors
===============

Exposes HTTP 4xx and 5xx status codes as JavaScript Error objects.

    var httpErrors = require('httperrors');

    // Instantiate by name (UpperCamelCase):
    var err = new httpErrors.NotFound('The thing you were looking for was not found');

    console.warn(err.toString()); // NotFound [404]: The thing you were looking for was not found

    if (identityCrisis) {
        throw new httpErrors.ImATeapot('Dude...');
    }

The error type is exposed as a true property on the instances, so your error handling
code becomes quite readable (and you can avoid using instanceof):

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
                return cb(new httpErrors[response.statusCode]());
            }
            // ...
        });
    }

Creating your own Error classes:

    var httpErrors = require('httperrors');

    var MyError = httpErrors.createError({
        type: 'MyError',
        // Used when no message is handed to the constructor:
        msg: 'A slightly longer description of the error'
    });

Instances can carry extra data about the error:

    try {
        throw new httpErrors.Forbidden({
            msg: "The message", // Not mandatory
            data: {disallowedIds: [1, 3, 4, 6]}
        });
    } catch(e) {
        console.warn(e.data); // {disallowedIds: [1, 3, 4, 6]}
    }

Inheriting from an existing Error class:

    var httpErrors = require('httperrors');

    var NotFoundUnderTheBedError = httpErrors.createError({
        type: 'NotFoundUnderTheBed',
        msg: 'I looked under the bed, but it was not found'
    }, httpErrors.NotFound);

Instances of this error walk and quack like `httpErrors.NotFound` instances, of course:

    var ohDear = new NotFoundUnderTheBedError('No monsters today');
    console.warn(ohDear.NotFound); // true
    console.warn(ohDear.NotFoundUnderTheBed); // true


License
-------

3-clause BSD license -- see the `LICENSE` file for details.
