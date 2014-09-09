var expect = require('unexpected'),
    httpErrors = require('../lib/httpErrors');

describe('httpErrors', function () {
    it('#.NotFound should produce NotFound instances', function() {
        var err = new httpErrors.NotFound('sadface');

        expect(err.statusCode, 'to equal', 404);
        expect(err.status, 'to equal', 404);
        expect(err.message, 'to equal', 'sadface');
        expect(err.name, 'to equal', 'NotFound');
    });

    it('BadGateway', function() {
        var err = new httpErrors.BadGateway();

        expect(err.statusCode, 'to equal', 502);
        expect(err.name, 'to equal', 'BadGateway');
    });

    it('constructor with object', function() {
        var err = new httpErrors.NotFound({
            message: 'foo',
            url: 'bar'
        });

        expect(err, 'to be an', httpErrors.NotFound);
        expect(err, 'to be an', Error);
        expect(err.message, 'to equal', 'foo');
        expect(err.url, 'to equal', 'bar');
    });

    it('constructor invoked without the "new" operator', function() {
        var err = httpErrors.NotFound({
            message: 'foo',
            url: 'bar'
        });

        expect(err, 'to be an', httpErrors.NotFound);
        expect(err, 'to be an', Error);
        expect(err.message, 'to equal', 'foo');
        expect(err.url, 'to equal', 'bar');
    });

    describe('when invoked as a function', function () {
        it('should create an instance of httpErrors.Unknown if called with no arguments', function () {
            expect(httpErrors().name, 'to equal', 'Unknown');
        });

        describe('and passed a number', function () {
            it('should create an instance of the proper error for a known status code', function () {
                expect(httpErrors(412).name, 'to equal', 'PreconditionFailed');
            });

            it('should create an instance of httpErrors.Unknown if given a status code that is not directly supported', function () {
                expect(httpErrors(595).name, 'to equal', 'Unknown');
            });
        });

        describe('and passed an options object', function () {
            it('should create an instance of httpErrors.Unknown if the status code is not directly supported', function () {
                expect(httpErrors({statusCode: 595}).name, 'to equal', 'Unknown');
            });

            it('should create an instance of httpErrors.Unknown if no status code is provided', function () {
                expect(httpErrors({foo: 'bar'}).name, 'to equal', 'Unknown');
            });
        });
    });
});
