var expect = require('unexpected');
var HttpError = require('../lib/HttpError');

describe('HttpError', function () {
    it('should produce instances that have an http property with a value of true', function () {
        expect(new HttpError.NotFound(), 'to have property', 'http', true);
    });

    it('should produce instances of HttpError.HttpError', function () {
        expect(new HttpError.NotFound(), 'to be a', HttpError.HttpError);
    });

    it('#.NotFound should produce NotFound instances', function() {
        var err = new HttpError.NotFound('sadface');

        expect(err.statusCode, 'to equal', 404);
        expect(err.status, 'to equal', 404);
        expect(err.message, 'to equal', 'sadface');
        expect(err.name, 'to equal', 'NotFound');
    });

    it('BadGateway', function() {
        var err = new HttpError.BadGateway();

        expect(err.statusCode, 'to equal', 502);
        expect(err.name, 'to equal', 'BadGateway');
    });

    it('constructor with object', function() {
        var err = new HttpError.NotFound({
            message: 'foo',
            url: 'bar'
        });

        expect(err, 'to be an', HttpError.NotFound);
        expect(err, 'to be an', Error);
        expect(err.message, 'to equal', 'foo');
        expect(err.url, 'to equal', 'bar');
    });

    it('constructor invoked without the "new" operator', function() {
        var err = HttpError.NotFound({
            message: 'foo',
            url: 'bar'
        });

        expect(err, 'to be an', HttpError.NotFound);
        expect(err, 'to be an', Error);
        expect(err.message, 'to equal', 'foo');
        expect(err.url, 'to equal', 'bar');
    });

    describe('when invoked as a function', function () {
        it('should create an instance of HttpError if called with no arguments', function () {
            expect(HttpError().name, 'to equal', 'HttpError');
        });

        describe('and passed a number', function () {
            it('should create an instance of the proper error for a known status code', function () {
                expect(HttpError(412).name, 'to equal', 'PreconditionFailed');
            });

            it('should create an instance of HttpError if given a status code that is not directly supported', function () {
                var instance = HttpError(595);
                expect(instance.name, 'to equal', 'HttpError');
                expect(instance.statusCode, 'to equal', 595);
            });
        });

        describe('and passed an options object', function () {
            it('should create an instance of HttpError if the status code is not directly supported', function () {
                expect(HttpError({statusCode: 595}).name, 'to equal', 'HttpError');
            });

            it('should create an instance of HttpError if no status code is provided', function () {
                expect(HttpError({foo: 'bar'}).name, 'to equal', 'HttpError');
            });
        });
    });

    it('has the HttpError superclass constructor as the main export', function () {
        expect(new HttpError.NotFound(), 'to be a', HttpError);
    });

    describe('#supports', function () {
        it('should return true for a mapped DNS error code', function () {
            expect(HttpError.supports('NotFound'), 'to be true');
        });

        it('should return false for an unmapped DNS error code', function () {
            expect(HttpError.supports('FOOBAR'), 'to be false');
        });

        it('should return true for a unmapped DNS error instance', function () {
            var fakeHttpError = new Error('NotFound');
            fakeHttpError.code = 'NotFound';
            expect(HttpError.supports(fakeHttpError), 'to be true');
        });

        it('should return false for a unmapped DNS error instance', function () {
            var fakeHttpError = new Error('FOOBAR');
            fakeHttpError.code = 'FOOBAR';
            expect(HttpError.supports(fakeHttpError), 'to be false');
        });
    });

    it('should provide RequestEntityTooLarge as a legacy alias for PayloadTooLarge', function () {
        expect(new HttpError.RequestEntityTooLarge(), 'to satisfy', { statusCode: 413, RequestEntityTooLarge: true, PayloadTooLarge: true });
    });

    it('should provide RequestURITooLarge as a legacy alias for URITooLong', function () {
        expect(new HttpError.RequestURITooLarge(), 'to satisfy', { statusCode: 414, RequestURITooLarge: true, URITooLong: true });
    });

    it('should provide RequestedRangeNotSatisfiable as a legacy alias for URITooLong', function () {
        expect(new HttpError.RequestedRangeNotSatisfiable(), 'to satisfy', { statusCode: 416, RequestedRangeNotSatisfiable: true, RangeNotSatisfiable: true });
    });
});
