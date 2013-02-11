define(['app/defer'], function(defer) {

    suite('defer');

    test('resolve', function(){
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            assert.strictEqual(value, expected);
            done();
        }, function () {
            done();
        });
        deferrable.resolve(expected);
    });

    test('reject', function(){
        var expected = 'expected';
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function () {
            done();
        }, function (reason) {
            assert.strictEqual(reason, expected);
            done();
        });
        deferrable.reject(expected);
    });
    
    test('chain', function(){
        var expectedPart1 = 'expectedPart1';
        var expectedPart2 = 'expectedPart1';
        var expected = expectedPart1 + expectedPart2;
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            return value + expectedPart2;
        }).then(function (value) {
            assert.strictEqual(value, expected);
            done();
        }, function () {
            done();
        });
        deferrable.resolve(expectedPart1);
    });
    
    test('throw', function(){
        var deferrable = defer();
        var promise = deferrable.promise;
        promise.then(function (value) {
            throw 'error';
            return value;
        }).then(function () {
            done();
        }, function () {
            assert.ok(true);
            done();
        });
        deferrable.resolve('unexpected');
    });
    
    return {};

});