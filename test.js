
// builtin
var assert = require('assert');

// local
var errors = require('./');

test('NotFound', function() {
    var err = new errors.NotFound('sadface');

    assert.equal(err.statusCode, 404);
    assert.equal(err.message, 'sadface');
    assert.equal(err.name, 'NotFound');
});

test('BadGateway', function() {
    var err = new errors.BadGateway();

    assert.equal(err.statusCode, 502);
    assert.equal(err.name, 'BadGateway');
});
