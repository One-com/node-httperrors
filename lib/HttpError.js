var createError = require('createerror');

// Copied from /lib/_http_server.js (node.js@7c9a691):
var httpErrorNameByStatusCode = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot', // RFC 2324
    421: 'Misdirected Request',
    422: 'Unprocessable Entity', // RFC 4918
    423: 'Locked', // RFC 4918
    424: 'Failed Dependency', // RFC 4918
    425: 'Unordered Collection', // RFC 4918
    426: 'Upgrade Required', // RFC 2817
    428: 'Precondition Required', // RFC 6585
    429: 'Too Many Requests', // RFC 6585
    431: 'Request Header Fields Too Large', // RFC 6585
    451: 'Unavailable For Legal Reasons',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates', // RFC 2295
    507: 'Insufficient Storage', // RFC 4918
    508: 'Loop Detected',
    509: 'Bandwidth Limit Exceeded',
    510: 'Not Extended', // RFC 2774
    511: 'Network Authentication Required' // RFC 6585
};

var HttpError = module.exports = createError({
    name: 'HttpError',
    preprocess: function (err) {
        if (!(err instanceof HttpError)) {
            if (typeof err === 'number' && !HttpError.hasOwnProperty(err)) {
                return { statusCode: err };
            } else if ((typeof err === 'string' || typeof err === 'number') && HttpError.hasOwnProperty(err)) {
                return new HttpError[err](err);
            } else if (err && err.code && HttpError.hasOwnProperty(err.code)) {
                return new HttpError[err.code](err);
            }
            // else return generic HttpError
        }
    }
});

HttpError.supports = function (errorOrErrorCode) {
    if (typeof errorOrErrorCode === 'string') {
        return HttpError.hasOwnProperty(errorOrErrorCode);
    } else if (errorOrErrorCode && errorOrErrorCode.code) {
        return HttpError.hasOwnProperty(errorOrErrorCode.code);
    } else {
        return false;
    }
};

// For backwards compatibility:
HttpError.HttpError = HttpError;

/// Map the error codes/names, as defined in Node's [http
/// module](http://nodejs.org/docs/latest/api/http.html).
Object.keys(httpErrorNameByStatusCode).forEach(function (statusCode) {
    addError(+statusCode, httpErrorNameByStatusCode[statusCode]);
});

function addError(statusCode, httpErrorName, Superclass) {
    statusCode = +statusCode; // turn into a number

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
    // allows for new HttpError[res.statusCode] in a http proxying setting
    var Subclass = createError({
        statusCode: statusCode,
        status: statusCode,
        name: name,
        http: true
    }, Superclass || HttpError.HttpError);

    HttpError[name] = Subclass;
    if (!HttpError[statusCode]) {
        HttpError[statusCode] = Subclass;
    }
    return Subclass;
}

addError(413, 'RequestEntityTooLarge', HttpError.PayloadTooLarge);
addError(414, 'RequestURITooLarge', HttpError.URITooLong);
addError(416, 'RequestedRangeNotSatisfiable', HttpError.RangeNotSatisfiable);
