var http = require('http'),
    util = require('util'),
    xtend = require('xtend'),
    httpErrors = module.exports;

httpErrors.createError = function (options, SuperConstructor) {
    SuperConstructor = SuperConstructor || Error;

    function Constructor(message) {
        SuperConstructor.call(this);
        Error.captureStackTrace(this, arguments.callee);

        if (typeof message === 'string') {
            this.message = message;
        } else if (typeof message === 'object' && message) {
            xtend(this, message);
        }
    };
    util.inherits(Constructor, SuperConstructor);

    xtend(Constructor.prototype, options);

    // to avoid doing if (err instanceof NotFound)
    // instead you can just do if (err.NotFound)
    Constructor.prototype[options.name] = true;

    Constructor.prototype.toString = function () {
        return this.name +
            (this.statusCode ? ' [' + this.statusCode + ']' : '') +
            (this.message ? ': ' + this.message : '');
    };

    return Constructor;
};

/// Map the error codes/names, as defined in Node's [http
/// module](http://nodejs.org/docs/latest/api/http.html).
Object.keys(http.STATUS_CODES).forEach(function(statusCode) {
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
    httpErrors[name] = httpErrors[statusCode] = httpErrors.createError({
        statusCode: statusCode,
        name: name
    });
});
