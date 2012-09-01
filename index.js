var http = require('http'),
    util = require('util'),
    createError = require('createerror'),
    httpErrors = module.exports;

/// Map the error codes/names, as defined in Node's [http
/// module](http://nodejs.org/docs/latest/api/http.html).
Object.keys(http.STATUS_CODES).forEach(function (statusCode) {
    statusCode = +statusCode; // turn into a number
    var httpErrorName = http.STATUS_CODES[statusCode];

    // Only include 4xx and 5xx
    if (statusCode < 400) {
        return;
    }

    // Invent a type by camel casing the usual message and removing
    // non-alphabetical chars
    var name = httpErrorName.replace(/ ([a-z])/gi, function ($0, $1) {
        return $1.toUpperCase();
    }).replace(/[^a-z]/gi, '');

    // Add the error to the exported object and alias it as `statusCode`
    // allows for new httpErrors[res.statusCode] in a http proxying setting
    httpErrors[name] = httpErrors[statusCode] = createError({
        statusCode: statusCode,
        name: name
    });
});
