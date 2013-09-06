var expect = require('unexpected'),
    httpErrors = require('../lib/httpErrors');

describe('httpErrors', function () {
    it('#.NotFound should produce NotFound instances', function() {
        var err = new httpErrors.NotFound('sadface');

        expect(err.statusCode, 'to equal', 404);
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
});
