var http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    httpErrors = module.exports = {};

httpErrors.createError = function (errorDefinition, SuperConstructor) {
    if (typeof errorDefinition === 'string') {
        errorDefinition = {type: errorDefinition};
    }

    SuperConstructor = SuperConstructor || Error;

    function Constructor(options) {
        Error.captureStackTrace(this, Constructor);
        if (typeof options === 'string') {
            if (arguments.length > 1 && typeof arguments[1] === 'object' && arguments[1] !== null) {
                arguments[1].msg = options;
                options = arguments[1];
            } else {
                options = {msg: options};
            }
        }
        _.extend(this, options);
        SuperConstructor.call(this, this.msg);
    };
    util.inherits(Constructor, SuperConstructor);

    _.extend(Constructor.prototype, errorDefinition);

    Constructor.prototype[errorDefinition.type] = true; // So you can avoid instanceof: if (err.NotFound) {...}

    Constructor.prototype.toString = function () {
        return this.type + (this.statusCode ? ' [' + this.statusCode + ']' : '') + (this.hasOwnProperty('msg') ? ': ' + this.msg : '');
    };
    return Constructor;
};

/*
 * Map the error codes/names, as defined in Node's [http
 * module](http://nodejs.org/docs/latest/api/http.html).
 */
_.each(http.STATUS_CODES, function (httpErrorName, statusCode) {
    statusCode = parseInt(statusCode, 10);
    // Only include 4xx and 5xx here.
    if (statusCode < 400) {
        return;
    }

    // Invent a type by camel casing the usual message and removing non-alphabetical chars
    var type = httpErrorName.replace(/ ([a-z])/gi, function ($0, $1) {
        return $1.toUpperCase();
    }).replace(/[^a-z]/gi, '');

    // Add the error to the exported object and alias it as `statusCode` so you can easily
    // say new errorClass[res.statusCode] in a http proxying setting.
    httpErrors[type] = httpErrors[statusCode] = httpErrors.createError({
        statusCode: statusCode,
        type: type,
        msg: httpErrorName
    });
});
